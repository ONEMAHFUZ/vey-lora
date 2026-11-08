// LocalDemoProvider — REAL local rule-based generation (summarizer, titles,
// translator dictionary, code explainer templates). Output is always
// labelled "LOCAL DEMO" — it is NOT a live AI model. Used only when no
// live provider is configured, so the demo page keeps working offline.
import type { AIRequest, AIResult, TextProvider } from "./types";

export class LocalDemoProvider implements TextProvider {
  name = "local-demo";

  isConfigured(): boolean {
    return true; // Always available — needs no key.
  }

  async generate(req: AIRequest): Promise<AIResult> {
    const input = req.input.trim();
    let output = "";
    switch (req.demoKey) {
      case "summarizer": {
        const sentences = input.split(/(?<=[.!?])\s+/).filter(Boolean);
        output = sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 3))).join(" ");
        break;
      }
      case "title-generator": {
        const words = input.split(/\s+/).filter(Boolean).slice(0, 6);
        output = [
          "How " + words.join(" ") + " Can Change the Way You Work",
          "The Complete Guide to " + words.join(" "),
          "5 Surprising Facts About " + words.join(" "),
        ].join("\n");
        break;
      }
      case "translator": {
        // Tiny EN->ES demo dictionary; anything unknown is passed through and labelled.
        const dict: Record<string, string> = {
          hello: "hola", world: "mundo", thank: "gracias", you: "tú", good: "bueno",
          morning: "mañana", friend: "amigo", love: "amor", yes: "sí", no: "no",
        };
        output = input.split(/\b/).map((w) => dict[w.toLowerCase()] ?? w).join("");
        break;
      }
      case "code-explainer":
        output =
          "LOCAL DEMO explanation (rule-based, not a live model):\n" +
          input.split("\n").slice(0, 12).map((l) => "- " + l.trim()).join("\n");
        break;
      case "text-writer":
        output =
          'LOCAL DEMO draft based on your prompt "' + req.prompt + '":\n\n' +
          input +
          "\n\n[Expand this draft with a configured AI provider for full generation.]";
        break;
      case "chat-assistant":
      default:
        output =
          'LOCAL DEMO reply: I received "' +
          input.slice(0, 200) +
          '". Connect an AI provider key to get a live model response.';
    }
    return { output, provider: "local-demo", model: "local-rules-v1", isLocalDemo: true };
  }
}
