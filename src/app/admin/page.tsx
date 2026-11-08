import Link from "next/link";
// Admin shell. Guard with isAdmin(role) server-side before launch.
const SECTIONS = ["Overview","Total Users","Active Users","AI Tools","Categories","Creators","Tool Submissions","Subscriptions","Payments","Usage Analytics","Revenue Analytics","Reviews","Reports","Support Tickets","Blog Management","Newsletter","API Providers","Website Settings","Admin Roles","Audit Logs"];
export default function Admin() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-slate-400">Restricted to ADMIN / SUPER_ADMIN roles. All figures below are placeholders until a live database is connected.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {SECTIONS.map((s) => (
          <div key={s} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-bold">{s}</h2><p className="text-sm text-slate-400">— (no live data yet)</p></div>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-400">Admin actions (publish/unpublish tools, approve submissions, suspend accounts, configure AI providers) are implemented as API routes backed by Prisma once DATABASE_URL is set. API keys are never shown to non-admin users.</p>
      <p className="mt-2"><Link href="/creator" className="text-violet-300 underline">Creator area</Link></p>
    </div>
  );
}
