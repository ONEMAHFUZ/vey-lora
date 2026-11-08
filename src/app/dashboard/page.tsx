import Link from "next/link";
// Dashboard shell. Protected routes: wire NextAuth getServerSession + redirect
// to /auth/signin in middleware / page guard before launch (see QA_REPORT.md).
const SECTIONS = [
  ["Overview", "Your plan, credits and recent activity at a glance."],
  ["My AI Tools", "Tools you use most, with quick demo links."],
  ["Active Subscriptions", "Current plan, renewal date and upgrade/downgrade."],
  ["Usage Statistics", "Demo runs, tokens and cost tracked per day."],
  ["Remaining Credits", "Your credit balance and daily demo allowance."],
  ["Saved AI Tools", "Your favourited tools."],
  ["Recently Used Tools", "Tools you tried most recently."],
  ["Billing History", "Invoices and payment records (test mode)."],
  ["Notifications", "Product and billing notifications."],
  ["Account Settings", "Profile, password and preferences."],
];
export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-slate-400">Sign in to load your real data. Demo values below are placeholders, not real usage.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-slate-400">Plan</p><p className="text-xl font-bold">Free (SAMPLE)</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-slate-400">Remaining credits</p><p className="text-xl font-bold">20 / 20 (SAMPLE)</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-slate-400">Demo runs today</p><p className="text-xl font-bold">0 (SAMPLE)</p></div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {SECTIONS.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-bold">{t}</h2><p className="text-sm text-slate-400">{d}</p></div>
        ))}
      </div>
      <p className="mt-6"><Link href="/pricing" className="text-violet-300 underline">Upgrade your plan</Link> · <Link href="/explore" className="text-violet-300 underline">Browse tools</Link></p>
    </div>
  );
}
