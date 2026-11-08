import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import { SAMPLE_TOOLS } from "@/data/tools";
import { CATEGORIES } from "@/data/categories";

export default function Home() {
  const popular = SAMPLE_TOOLS.slice(0, 6);
  const trending = SAMPLE_TOOLS.slice(6, 12);
  const newest = SAMPLE_TOOLS.slice(12, 18);
  return (
    <div>
      <section className="bg-hero-gradient px-4 py-20 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold md:text-6xl">Discover the Power of Artificial Intelligence</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">Explore, test, and experience the world&apos;s most innovative AI tools — all in one place.</p>
        <div className="mt-8 flex justify-center"><SearchBar /></div>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/explore" className="rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-semibold">Explore AI Tools</Link>
          <Link href="/creator" className="rounded-xl border border-white/30 px-6 py-3 font-semibold">Submit Your Tool</Link>
        </div>
        <div className="mt-10 flex justify-center gap-10 text-center">
          <div><p className="text-2xl font-bold">{SAMPLE_TOOLS.length}</p><p className="text-sm text-slate-400">AI Tools (SAMPLE)</p></div>
          <div><p className="text-2xl font-bold">{CATEGORIES.length}</p><p className="text-sm text-slate-400">Categories</p></div>
          <div><p className="text-2xl font-bold">—</p><p className="text-sm text-slate-400">Active Users (not yet measured)</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold">Popular AI Tools</h2>
        <p className="text-sm text-slate-400">SAMPLE listings for demonstration.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{popular.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold">Trending AI Tools</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{trending.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold">New AI Tools</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{newest.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold">AI Categories</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/categories`} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-violet-400/60">
              <span className="text-2xl">{c.icon}</span><p className="mt-2 font-semibold">{c.name}</p><p className="text-xs text-slate-400">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold">Why Choose VEY LORA</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="font-bold">Real demos</h3><p className="text-sm text-slate-400">Try tools before subscribing — demos run on a labelled local provider until an AI key is configured.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="font-bold">One subscription</h3><p className="text-sm text-slate-400">Credits and plans across tools, with billing verified server-side.</p></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="font-bold">Creator marketplace</h3><p className="text-sm text-slate-400">Creators submit tools for review; only approved tools are published.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          <li className="rounded-2xl border border-white/10 bg-white/5 p-5"><b>1. Discover</b><p className="text-sm text-slate-400">Browse categories and search.</p></li>
          <li className="rounded-2xl border border-white/10 bg-white/5 p-5"><b>2. Try</b><p className="text-sm text-slate-400">Run a live demo with your daily credits.</p></li>
          <li className="rounded-2xl border border-white/10 bg-white/5 p-5"><b>3. Subscribe</b><p className="text-sm text-slate-400">Pick a plan and unlock premium access.</p></li>
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold">User Reviews</h2>
        <p className="text-sm text-slate-400">No real user reviews exist yet. Reviews shown after launch will be real, verified reviews only.</p>
        <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-slate-400">SAMPLE review placeholder — no fabricated testimonials are published.</div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold">Newsletter</h2>
        <form action="/api/newsletter" method="post" className="mt-4 flex max-w-md gap-2">
          <input name="email" type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" />
          <button className="rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 font-semibold">Subscribe</button>
        </form>
      </section>

      <section className="bg-hero-gradient px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to discover your next AI tool?</h2>
        <Link href="/explore" className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-bold text-navy-900">Explore AI Tools</Link>
      </section>
    </div>
  );
}
