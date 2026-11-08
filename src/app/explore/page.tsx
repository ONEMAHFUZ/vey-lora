import ToolCard from "@/components/ToolCard";
import { SAMPLE_TOOLS } from "@/data/tools";
import { CATEGORIES } from "@/data/categories";
import Link from "next/link";

export default function Explore({ searchParams }: { searchParams?: { q?: string; category?: string; pricing?: string; sort?: string } }) {
  const q = (searchParams?.q || "").toLowerCase();
  const cat = searchParams?.category || "";
  const pricing = searchParams?.pricing || "";
  let tools = SAMPLE_TOOLS.filter((t) =>
    (!q || (t.name + t.description + t.category).toLowerCase().includes(q)) &&
    (!cat || t.category === cat) && (!pricing || t.pricing === pricing));
  if (searchParams?.sort === "rating") tools = [...tools].sort((a, b) => b.ratingSample - a.ratingSample);
  if (searchParams?.sort === "newest") tools = [...tools].reverse();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Explore AI Tools</h1>
      <p className="text-sm text-slate-400">All listings are SAMPLE data.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/explore" className="rounded-full border border-white/20 px-3 py-1 text-sm">All</Link>
        {CATEGORIES.map((c) => <Link key={c.slug} href={`/explore?category=${encodeURIComponent(c.name)}`} className="rounded-full border border-white/20 px-3 py-1 text-sm">{c.name}</Link>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link href="/explore?pricing=Free">Free</Link><Link href="/explore?pricing=Paid">Paid</Link><Link href="/explore?pricing=Freemium">Freemium</Link>
        <span className="text-slate-500">|</span>
        <Link href="/explore?sort=rating">Highest rated</Link><Link href="/explore?sort=newest">Recently added</Link>
      </div>
      {tools.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/20 p-10 text-center text-slate-400">No tools match your filters. Try clearing the search.</div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      )}
      <p className="mt-6 text-sm text-slate-500">Showing {tools.length} of {SAMPLE_TOOLS.length} sample tools. Pagination is implemented in the API route (/api/tools).</p>
    </div>
  );
}
