"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SearchBar({ placeholder = "Search AI tools, image generators, writing assistants..." }: { placeholder?: string }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form onSubmit={(e) => { e.preventDefault(); router.push("/explore?q=" + encodeURIComponent(q)); }} className="flex w-full max-w-xl gap-2">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label="Search AI tools" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400" />
      <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-5 font-semibold">Search</button>
    </form>
  );
}
