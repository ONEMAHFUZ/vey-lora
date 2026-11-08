import Link from "next/link";
export default function NotFound() {
  return <div className="mx-auto max-w-2xl px-4 py-20 text-center"><h1 className="text-3xl font-bold">Page not found</h1><p className="mt-2 text-slate-400">The page you&apos;re looking for doesn&apos;t exist.</p><Link href="/" className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 font-semibold">Back to home</Link></div>;
}
