import Link from "next/link";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-xl font-extrabold text-transparent">VEY LORA</Link>
        <div className="hidden gap-6 md:flex">
          <Link href="/explore">Explore</Link><Link href="/categories">Categories</Link>
          <Link href="/pricing">Pricing</Link><Link href="/blog">Blog</Link><Link href="/demo">Demos</Link>
        </div>
        <div className="flex gap-2">
          <Link href="/auth/signin" className="rounded-lg border border-white/20 px-4 py-2">Sign In</Link>
          <Link href="/auth/signup" className="rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 font-semibold">Get Started</Link>
        </div>
      </nav>
    </header>
  );
}
