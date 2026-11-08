import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950 px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div><p className="text-lg font-bold">VEY LORA</p><p className="text-sm text-slate-400">Discover. Try. Subscribe.</p></div>
        <div><p className="font-semibold">Product</p><ul className="text-sm text-slate-400"><li><Link href="/explore">Explore</Link></li><li><Link href="/categories">Categories</Link></li><li><Link href="/pricing">Pricing</Link></li><li><Link href="/demo">Demos</Link></li></ul></div>
        <div><p className="font-semibold">Company</p><ul className="text-sm text-slate-400"><li><Link href="/about">About Us</Link></li><li><Link href="/blog">Blog</Link></li><li><Link href="/contact">Contact</Link></li><li><Link href="/faq">FAQ</Link></li></ul></div>
        <div><p className="font-semibold">Legal</p><ul className="text-sm text-slate-400"><li><Link href="/privacy">Privacy Policy</Link></li><li><Link href="/terms">Terms of Service</Link></li></ul></div>
      </div>
      <p className="mt-8 text-center text-xs text-slate-500">© 2026 VEY LORA. All rights reserved.</p>
    </footer>
  );
}
