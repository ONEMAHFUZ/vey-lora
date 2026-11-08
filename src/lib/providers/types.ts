// VEY LORA provider layer — shared types.
// Phase B: live TEXT providers (Gemini + Groq, $0 free tiers) with a
// Gemini -> Groq fallback router and a labelled local-demo fallback.
// API keys are NEVER read from anywhere except server-side env vars
// (GEMINI_API_KEY, GROQ_API_KEY). No key is ever sent to the client,
// logged, or committed.

export interface AIRequest {
  prompt: string;
  input: string;
  /** One of the 6 wired text tools, e.g. "chat-assistant", "summarizer". */
  demoKey: string;
}

export interface AIResult {
  output: string;
  provider: string;
  model: string;
  /** True only for the rule-based local demo — never a live model. */
  isLocalDemo: boolean;
  /** Tokens reported by the provider, when available. */
  tokensUsed?: number;
}

export interface TextProvider {
  name: string;
  /** True when this provider can actually be called (server key present). */
  isConfigured(): boolean;
  generate(req: AIRequest): Promise<AIResult>;
}

export type ProviderErrorKind =
  | "rate-limit" // 429 / quota exhausted — retryable, fall through to next provider
  | "config" // missing/invalid key, unknown model — fall through, admin must fix env
  | "validation" // blocked input, bad request — do NOT fall through
  | "upstream" // 5xx / network / timeout — retryable, fall through
  | "timeout";

/** Error with a user-facing message. Never includes API keys or raw bodies. */
export class ProviderError extends Error {
  readonly kind: ProviderErrorKind;
  readonly status: number;
  constructor(message: string, kind: ProviderErrorKind = "upstream", status = 503) {
    super(message);
    this.name = "ProviderError";
    this.kind = kind;
    this.status = status;
  }
  get isRateLimit(): boolean {
    return this.kind === "rate-limit";
  }
  get isConfigError(): boolean {
    return this.kind === "config";
  }
  /** Whether the router should try the next provider. */
  get isRetryable(): boolean {
    return this.kind !== "validation";
  }
}

export const ALL_PROVIDERS_BUSY_MESSAGE =
  "All AI providers are busy or out of free quota right now. Please try again in a few minutes — your credits were not used.";

export const LIMIT_REACHED_MESSAGE =
  "Daily limit reached for your plan. Sign in or upgrade for a higher daily limit — your credits were not used.";

/** The 6 text tools wired through the provider layer (Phase B). */
export const TEXT_TOOL_KEYS = [
  "chat-assistant",
  "text-writer",
  "summarizer",
  "translator",
  "title-generator",
  "code-explainer",
] as const;

export type TextToolKey = (typeof TEXT_TOOL_KEYS)[number];

export function isTextToolKey(key: string): key is TextToolKey {
  return (TEXT_TOOL_KEYS as readonly string[]).includes(key);
}

/** Short system instructions per tool — kept short to save free-tier tokens. */
const SYSTEM_PROMPTS: Record<string, string> = {
  "chat-assistant":
    "You are LoraChat, VEY LORA's friendly AI assistant. Answer clearly and concisely, in the user's language.",
  "text-writer":
    "You are an expert copywriter. Write clear, useful, well-structured text based on the user's request.",
  summarizer:
    "Summarize the following text faithfully. Keep the key facts, drop repetition, and stay concise.",
  translator:
    "Translate the following English text into Spanish. Return only the translation, no explanation.",
  "title-generator":
    "Generate 5 catchy, distinct titles for the topic below. Return one title per line, no numbering.",
  "code-explainer":
    "Explain the following code in simple, plain language. Describe what each part does and the overall purpose.",
};

export function buildTextPrompt(demoKey: string, prompt: string, input: string): { system: string; user: string } {
  const system = SYSTEM_PROMPTS[demoKey] ?? SYSTEM_PROMPTS["chat-assistant"];
  const user = prompt.trim() ? `${prompt.trim()}\n\n${input.trim()}` : input.trim();
  return { system, user };
}

/** fetch with a hard timeout so a hung provider cannot hang the request. */
export async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 30000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    // Browser-like User-Agent: Groq sits behind Cloudflare, which blocks
    // non-browser UAs (error 1010) — Node's default "node" UA is rejected.
    const headers = new Headers(init.headers);
    if (!headers.has("User-Agent")) {
      headers.set(
        "User-Agent",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      );
    }
    return await fetch(url, { ...init, headers, signal: ctrl.signal });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      throw new ProviderError("The AI provider timed out. Please try again.", "timeout", 504);
    }
    // Network failure — retryable, the router will try the next provider.
    throw new ProviderError("Could not reach the AI provider. Please try again.", "upstream", 503);
  } finally {
    clearTimeout(timer);
  }
}

/** Safely read a provider error body without leaking secrets. */
export async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: { message?: string } | string; message?: string };
    const msg = typeof data.error === "string" ? data.error : data.error?.message ?? data.message ?? "";
    return msg.slice(0, 300);
  } catch {
    return "";
  }
}
