// Stripe abstraction — TEST MODE ONLY until the business/payment account is
// authorised. Premium access is NEVER unlocked from a frontend redirect;
// only a verified webhook (api/webhooks/stripe) may change subscription state.
// No card details are ever stored by VEY LORA.
import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("PLACEHOLDER")) return null;
  return new Stripe(key);
}
export function stripeConfigured(): boolean { return getStripe() !== null; }
export function verifyWebhookSignature(rawBody: string, signature: string): Stripe.Event {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) throw new Error("Stripe webhook not configured.");
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
