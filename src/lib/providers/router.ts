// Provider router — tries providers in admin-configured order
// (default: Gemini -> Groq) and falls back on rate-limit, config,
// upstream and timeout errors. A validation error (blocked input)
// is returned immediately without burning the next provider.
// When no live provider is configured, the labelled local demo is used
// so the demo page keeps working offline.
import { GeminiAdapter, geminiFlashModel, geminiLiteModel } from "./gemini";
import { GroqAdapter, groqModel } from "./groq";
import { LocalDemoProvider } from "./local-demo";
import { getProviderConfig, providerOrderFromConfig } from "./config";
import type { ProviderName } from "./config";
import { ALL_PROVIDERS_BUSY_MESSAGE, ProviderError } from "./types";
import type { AIRequest, AIResult, TextProvider } from "./types";

export interface ProviderAvailability {
  name: ProviderName;
  configured: boolean;
  model: string;
}

const localDemo = new LocalDemoProvider();

export function getConfiguredProviders(): ProviderAvailability[] {
  const gemini = new GeminiAdapter();
  const groq = new GroqAdapter();
  return [
    { name: "gemini", configured: gemini.isConfigured(), model: geminiLiteModel() },
    { name: "groq", configured: groq.isConfigured(), model: groqModel() },
    { name: "local-demo", configured: true, model: "local-rules-v1" },
  ];
}

function adapterFor(name: ProviderName): TextProvider {
  if (name === "groq") return new GroqAdapter();
  if (name === "local-demo") return localDemo;
  return new GeminiAdapter();
}

export async function getProviderOrder(): Promise<ProviderName[]> {
  const cfg = await getProviderConfig();
  return providerOrderFromConfig(cfg);
}

export async function generateText(req: AIRequest): Promise<AIResult> {
  const order = await getProviderOrder();
  let lastError: ProviderError | null = null;

  for (const name of order) {
    const adapter = adapterFor(name);
    if (!adapter.isConfigured()) continue;
    try {
      return await adapter.generate(req);
    } catch (e) {
      if (e instanceof ProviderError) {
        if (e.kind === "validation") throw e; // bad/blocked input — don't try the next provider
        lastError = e;
        continue;
      }
      lastError = new ProviderError(
        `Live AI is unavailable right now (${e instanceof Error ? e.message : "unknown error"}).`,
        "upstream",
        503,
      );
    }
  }

  if (lastError) {
    if (lastError.isRateLimit) {
      throw new ProviderError(ALL_PROVIDERS_BUSY_MESSAGE, "rate-limit", 429);
    }
    if (lastError.isConfigError) {
      // Keep the specific admin guidance (which key / model to fix).
      throw lastError;
    }
    throw new ProviderError(
      `Live AI is unavailable right now (${lastError.message}). Your credits were not used.`,
      "upstream",
      503,
    );
  }

  // No live provider configured at all — labelled local demo.
  return localDemo.generate(req);
}

// Re-exported for callers that need the concrete models.
export { geminiFlashModel, geminiLiteModel, groqModel };
