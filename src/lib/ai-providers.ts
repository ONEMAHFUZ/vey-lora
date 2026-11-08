// Compatibility shim — the provider layer now lives in src/lib/providers/*.
// Kept so existing imports (`getProvider`) keep working.
// New code should import from "@/lib/providers/router" and "@/lib/usage".
export * from "./providers/types";
export { LocalDemoProvider } from "./providers/local-demo";
export { GeminiAdapter } from "./providers/gemini";
export { GroqAdapter } from "./providers/groq";
export { generateText, getConfiguredProviders } from "./providers/router";
export { getProviderConfig } from "./providers/config";

import { generateText } from "./providers/router";
import type { AIRequest, AIResult, TextProvider } from "./providers/types";

/** Legacy sync accessor: returns a provider that routes Gemini -> Groq. */
export function getProvider(): TextProvider {
  return {
    name: "router",
    isConfigured: () => true,
    generate: (req: AIRequest): Promise<AIResult> => generateText(req),
  };
}

export default getProvider;
