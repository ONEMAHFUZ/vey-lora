"use client";
import { useState } from "react";
const DEMOS = [
  { key: "chat-assistant", name: "AI Chat Assistant", placeholder: "Ask a question..." },
  { key: "text-writer", name: "AI Text Writer", placeholder: "Describe what to write..." },
  { key: "summarizer", name: "AI Text Summarizer", placeholder: "Paste long text to summarise..." },
  { key: "translator", name: "AI Translator", placeholder: "Type English text (EN→ES demo dictionary)..." },
  { key: "title-generator", name: "AI Title Generator", placeholder: "Enter a topic..." },
  { key: "code-explainer", name: "AI Code Explainer", placeholder: "Paste code..." },
];
export default function DemoPage() {
  const [active, setActive] = useState(DEMOS[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uses, setUses] = useState(0);
  const limit = 5; // guest daily limit shown in UI; server enforces the real limit
  async function generate() {
    if (!input.trim()) { setError("Please enter some text first."); return; }
    if (uses >= limit) { setError(`Demo limit reached (${limit} runs). Sign in for a higher daily limit.`); return; }
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch(`/api/demo/${active.key}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo failed.");
      setOutput(data.output + (data.isLocalDemo ? "\n\n— LOCAL DEMO output (rule-based, not a live AI model)" : ""));
      setUses((u) => u + 1);
    } catch (e) { setError(e instanceof Error ? e.message : "Demo failed."); }
    finally { setLoading(false); }
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">AI Demos — Try it live</h1>
      <p className="text-slate-400">Demos run on the labelled LOCAL DEMO provider until an AI API key is configured. Never presented as live AI output. Usage: {uses}/{limit} this session.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {DEMOS.map((d) => <button key={d.key} onClick={() => { setActive(d); setOutput(""); setError(""); }} className={`rounded-full px-4 py-2 text-sm ${active.key === d.key ? "bg-violet-600" : "border border-white/20"}`}>{d.name}</button>)}
      </div>
      <h2 className="mt-8 font-bold">{active.name}</h2>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={active.placeholder} rows={6} className="mt-2 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" />
      <div className="mt-3 flex gap-2">
        <button onClick={generate} disabled={loading} className="rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-semibold disabled:opacity-50">{loading ? "Generating…" : "Generate"}</button>
        <button onClick={() => { setOutput(""); setInput(""); setError(""); }} className="rounded-xl border border-white/20 px-6 py-3">Clear</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="rounded-xl border border-white/20 px-6 py-3">Copy output</button>}
      </div>
      {error && <p role="alert" className="mt-4 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-300">{error}</p>}
      {loading && <div className="mt-4 animate-pulse rounded-xl border border-white/10 bg-white/5 p-6 text-slate-400">Generating…</div>}
      {output && <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-6 text-slate-200">{output}</pre>}
    </div>
  );
}
