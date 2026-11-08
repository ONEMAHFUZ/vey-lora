const FAQS = [
  ["What is VEY LORA?", "An AI tools marketplace where you discover, try and subscribe to AI tools."],
  ["Can I try tools before paying?", "Yes — the demo engine gives limited free demo runs per day. Demos run on a labelled LOCAL DEMO provider until an AI API key is configured."],
  ["How do subscriptions work?", "Choose Free, Starter, Pro or Premium, monthly or yearly. Payments are verified server-side via Stripe webhooks; access is never unlocked from a frontend redirect."],
  ["Can I submit my own AI tool?", "Yes — creators register, submit a tool, and it is published only after admin approval."],
  ["Are payments live?", "No. Payments are in test mode only until the business and payment account are properly authorised."],
];
export default function Faq() {
  return <div className="mx-auto max-w-4xl px-4 py-10"><h1 className="text-3xl font-bold">FAQ</h1><div className="mt-6 space-y-4">{FAQS.map(([q, a]) => <div key={q} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-bold">{q}</h2><p className="mt-1 text-slate-300">{a}</p></div>)}</div></div>;
}
