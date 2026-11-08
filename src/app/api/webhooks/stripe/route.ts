import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/stripe";

// Stripe webhook: the ONLY place subscription/payment state changes.
// Never trust a frontend redirect. Signature-verified events only.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const rawBody = await req.text();
  try {
    const event = verifyWebhookSignature(rawBody, signature);
    // TODO (needs DB): handle checkout.session.completed,
    // invoice.payment_succeeded / payment_failed, customer.subscription.updated/deleted
    // by updating UserSubscription / Payment via Prisma. No state changes here yet.
    return NextResponse.json({ received: true, type: event.type });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Webhook verification failed" }, { status: 400 });
  }
}
