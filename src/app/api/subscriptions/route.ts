import { NextResponse } from "next/server";
import { PLANS } from "@/data/tools";
// Subscription read endpoint. Checkout / upgrade / cancel go through Stripe
// Checkout + webhooks; access changes only after webhook verification.
export async function GET() {
  return NextResponse.json({ plans: PLANS, note: "Test mode only. No real payments until the payment account is authorised." });
}
export async function POST() {
  return NextResponse.json({ error: "Checkout is not enabled yet: Stripe keys are not configured. Set STRIPE_SECRET_KEY (test mode) first." }, { status: 503 });
}
