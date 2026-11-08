// Google Gemini adapter — live TEXT generation on the $0 free tier.
// Key ONLY from server-side env var GEMINI_API_KEY (never client code).
// Flash-Lite first (highest free daily quota), Flash as in-adapter fallback.
// Model IDs are env-overridable: if Google retires/renames a model the admin
// sets GEMINI_MODEL_LITE / GEMINI_MODEL to the current IDs from AI Studio.
import {
  buildTextPrompt,
  fetchWithTimeout,
  ProviderError,
  readErrorMessage,
} from "./types";
import type { AIRequest, AIResult, TextProvider } from "./types";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export function geminiLiteModel(): string {
  return process.env.GEMINI_MODEL_LITE || "gemini-3.5-flash-lite";
}

export function geminiFlashModel(): string {
  return process.env.GEMINI_MODEL || "gemini-3.6-flash";
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { totalTokenCount?: number };
}

export class GeminiAdapter implements TextProvider {
  name = "gemini";

  isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY;
  }

  async generate(req: AIRequest): Promise<AIResult> {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new ProviderError(
        "Gemini is not configured: set GEMINI_API_KEY on the server to enable it.",
        "config",
        503,
      );
    }
    const { system, user } = buildTextPrompt(req.demoKey, req.prompt, req.input);
    // Flash-Lite first; Flash if Lite is unavailable (404) or rate-limited.
    const models = [geminiLiteModel(), geminiFlashModel()];
    let lastError: ProviderError | null = null;
    for (const model of models) {
      try {
        return await this.callModel(model, key, system, user);
      } catch (e) {
        if (e instanceof ProviderError && (e.kind === "rate-limit" || e.kind === "config")) {
          // Model unknown (404) or quota hit: try the other Gemini model.
          lastError = e;
          continue;
        }
        throw e; // validation / upstream errors bubble up to the router
      }
    }
    // Both Gemini models failed with rate-limit/config errors.
    throw (
      lastError ??
      new ProviderError("Gemini is unavailable right now. Please try again.", "upstream", 503)
    );
  }

  private async callModel(
    model: string,
    key: string,
    system: string,
    user: string,
  ): Promise<AIResult> {
    const res = await fetchWithTimeout(`${GEMINI_BASE}/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });
    if (!res.ok) {
      const detail = await readErrorMessage(res);
      if (res.status === 429) {
        throw new ProviderError(
          "Gemini free-tier limit reached for now (daily quota used up). It resets at midnight Pacific time — or try again in a few minutes.",
          "rate-limit",
          429,
        );
      }
      if (res.status === 404) {
        throw new ProviderError(
          `Gemini model "${model}" was not found. An admin should set GEMINI_MODEL_LITE / GEMINI_MODEL to the current model IDs from Google AI Studio.`,
          "config",
          503,
        );
      }
      if (res.status === 400) {
        throw new ProviderError(
          `Gemini rejected the request${detail ? ": " + detail : "."}`,
          "validation",
          400,
        );
      }
      if (res.status === 401 || res.status === 403) {
        throw new ProviderError(
          "Gemini API key is invalid or lacks access. An admin should check GEMINI_API_KEY on the server.",
          "config",
          503,
        );
      }
      throw new ProviderError(
        `Gemini returned an error (${res.status}). Please try again.`,
        "upstream",
        503,
      );
    }
    const data = (await res.json()) as GeminiResponse;
    if (data.promptFeedback?.blockReason) {
      throw new ProviderError(
        "Gemini blocked this request with its safety filter. Please rephrase your input and try again.",
        "validation",
        400,
      );
    }
    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();
    if (!text) {
      throw new ProviderError(
        "Gemini returned an empty response. Please try again.",
        "upstream",
        503,
      );
    }
    return {
      output: text,
      provider: "gemini",
      model,
      isLocalDemo: false,
      tokensUsed: data.usageMetadata?.totalTokenCount,
    };
  }
}
