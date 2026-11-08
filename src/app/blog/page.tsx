import Link from "next/link";
export default function Blog() {
  return <div className="mx-auto max-w-4xl px-4 py-10"><h1 className="text-3xl font-bold">Blog</h1><p className="mt-4 text-slate-400">No posts published yet. Blog posts are managed in the Admin Dashboard (Blog Management) and stored in the BlogPost model.</p><p className="mt-4"><Link href="/contact" className="text-violet-300 underline">Contact us</Link> to suggest a topic.</p></div>;
}
