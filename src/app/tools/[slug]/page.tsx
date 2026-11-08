import { notFound } from "next/navigation";
import Link from "next/link";
import { SAMPLE_TOOLS } from "@/data/tools";
export default function ToolDetail({ params }: { params: { slug: string } }) {
  const tool = SAMPLE_TOOLS.find((t) => t.slug === params.slug);
  if (!tool) notFound();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm text-amber-300">SAMPLE listing — description, rating and features are placeholders, not real data.</p>
      <h1 className="mt-2 text-3xl font-bold">{tool.name}</h1>
      <p className="mt-2 text-slate-300">{tool.description}</p>
      <p className="mt-2 text-sm text-slate-400">{tool.category} · {tool.pricing}{tool.priceMonthly ? ` · $${tool.priceMonthly}/mo` : ""} · ★ {tool.ratingSample} (SAMPLE rating)</p>
      <h2 className="mt-8 font-bold">Features</h2>
      <ul className="mt-2 list-disc pl-5 text-slate-300">{tool.features.map((f) => <li key={f}>{f}</li>)}</ul>
      <h2 className="mt-8 font-bold">Supported languages</h2>
      <p className="text-slate-300">{tool.languages.join(", ")}</p>
      <h2 className="mt-8 font-bold">Reviews</h2>
      <p className="text-slate-400">No real reviews yet. Reviews will appear here once real users review this tool.</p>
      <div className="mt-8 flex gap-3">
        {tool.demoAvailable && <Link href="/demo" className="rounded-xl bg-violet-600 px-5 py-3 font-semibold">Try Demo</Link>}
        <Link href="/pricing" className="rounded-xl border border-white/20 px-5 py-3">See Pricing</Link>
      </div>
    </div>
  );
}
