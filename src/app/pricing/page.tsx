import Link from "next/link";
import { PLANS } from "@/data/tools";
export default function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="text-slate-400">Monthly and yearly billing. Payments are in test mode only until the payment account is authorised — no real charges.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {PLANS.map((p) => (
          <div key={p.tier} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">{p.name}</h2>
            <p className="mt-2 text-3xl font-extrabold">${p.monthly}<span className="text-sm font-normal">/mo</span></p>
            <p className="text-sm text-slate-400">${p.yearly}/year · {p.credits} monthly credits</p>
            <ul className="mt-4 space-y-1 text-sm text-slate-300">{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
            <Link href="/auth/signup" className="mt-6 block rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2 text-center font-semibold">Choose {p.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
