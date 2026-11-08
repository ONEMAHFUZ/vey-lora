// Groq adapter — live TEXT generation on the $0 free tier.
// Key ONLY from server-side env var GROQ_API_KEY (never client code).
// Uses Groq's OpenAI-compatible chat completions endpoint.
// Default model is env-overridable via GROQ_MODEL.
import {
  buildTextPrompt,
  fetchWithTimeout,
  ProviderError,
  readErrorMessage,
} from "./types";
import type { AIRequest, AIResult, TextProvider } from "./types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export function groqModel(): string {
  return process.env.GROQ_MODEL || "openai/gpt-oss-120b";
}

interface GroqResponse {
  choices?: Array<{ message?: { content?: string | null }; finish_reason?: string }>;
  usage?: { total_tokens?: number };
}

export class GroqAdapter implements TextProvider {
  name = "groq";

  isConfigured(): boolean {
    return !!process.env.GROQ_API_KEY;
  }

  async generate(req: AIRequest): Promise<AIResult> {
    const key = process.env.GROQ_API_KEY;
    if (!key) {
      throw new ProviderError(
        "Groq is not configured: set GROQ_API_KEY on the server to enable it.",
        "config",
        503,
      );
    }
    const model = groqModel();
    const { system, user } = buildTextPrompt(req.demoKey, req.prompt, req.input);
    const res = await fetchWithTimeout(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });
    if (!res.ok) {
      const detail = await readErrorMessage(res);
      if (res.status === 429) {
        throw new ProviderError(
          "Groq free-tier limit reached for now (daily quota used up). Please try again later.",
          "rate-limit",
          429,
        );
      }
      if (res.status === 401) {
        throw new ProviderError(
          "Groq API key is invalid. An admin should check GROQ_API_KEY on the server.",
          "config",
          503,
        );
      }
      if (res.status === 400) {
        throw new ProviderError(
          `Groq rejected the request${detail ? ": " + detail : ". An admin should check GROQ_MODEL."}`,
          "config",
          503,
        );
      }
      throw new ProviderError(
        `Groq returned an error (${res.status}). Please try again.`,
        "upstream",
        503,
      );
    }
    const data = (await res.json()) as GroqResponse;
    const text = (data.choices?.[0]?.message?.content ?? "").trim();
    if (!text) {
      throw new ProviderError(
        "Groq returned an empty response. Please try again.",
        "upstream",
        503,
      );
    }
    return {
      output: text,
      provider: "groq",
      model,
      isLocalDemo: false,
      tokensUsed: data.usage?.total_tokens,
    };
  }
}
