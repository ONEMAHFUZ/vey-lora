import Link from "next/link";
import type { SampleTool } from "@/data/tools";
export default function ToolCard({ tool }: { tool: SampleTool }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-violet-400/60">
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-xl font-bold">{tool.name[0]}</span>
        <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{tool.pricing}</span>
      </div>
      <h3 className="mt-3 text-lg font-bold">{tool.name}</h3>
      <p className="text-sm text-slate-400">{tool.description}</p>
      <p className="mt-2 text-xs text-slate-500">{tool.category} · ★ {tool.ratingSample} (SAMPLE rating)</p>
      <div className="mt-4 flex gap-2">
        {tool.demoAvailable && <Link href="/demo" className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold">Try Demo</Link>}
        <Link href={`/tools/${tool.slug}`} className="rounded-lg border border-white/20 px-3 py-2 text-sm">View Details</Link>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">SAMPLE listing — not a real tool or real rating.</p>
    </article>
  );
}
