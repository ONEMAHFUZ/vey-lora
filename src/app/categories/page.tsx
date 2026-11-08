import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { SAMPLE_TOOLS } from "@/data/tools";
export default function Categories() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">AI Categories</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {CATEGORIES.map((c) => {
          const count = SAMPLE_TOOLS.filter((t) => t.category === c.name).length;
          return (
            <Link key={c.slug} href={`/explore?category=${encodeURIComponent(c.name)}`} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-violet-400/60">
              <span className="text-2xl">{c.icon}</span><h2 className="mt-2 font-bold">{c.name}</h2>
              <p className="text-sm text-slate-400">{c.description}</p><p className="mt-2 text-xs text-slate-500">{count} sample tool(s)</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
