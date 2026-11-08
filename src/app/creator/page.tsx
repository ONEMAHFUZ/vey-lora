export default function Creator() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Creator Dashboard</h1>
      <p className="text-slate-400">Submit a tool for review. Workflow: Submitted → Under Review → Approved / Rejected → Published. Only tools you own or are authorised to distribute may be published. Payouts stay disabled until legal, tax, payment and identity requirements are satisfied.</p>
      <h2 className="mt-8 text-xl font-bold">Submit a new AI tool</h2>
      <form action="/api/tools" method="post" className="mt-4 space-y-3">
        <input name="name" required placeholder="Tool name" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" />
        <textarea name="description" required placeholder="Description" rows={4} className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" />
        <input name="category" required placeholder="Category (e.g. AI Writing)" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" />
        <input name="websiteUrl" placeholder="External website URL (optional)" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" />
        <button className="rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-semibold">Submit for review</button>
      </form>
      <h2 className="mt-10 text-xl font-bold">Your tools</h2>
      <p className="text-slate-400">No submissions yet. Published tools, pending submissions, views, demo usage, subscriptions, earnings and payout records will appear here once the database is connected.</p>
    </div>
  );
}
