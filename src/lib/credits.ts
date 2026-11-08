// Credit helpers. Daily demo limits are enforced in the demo API route;
// plan credit grants live on SubscriptionPlan.monthlyCredits.
export const DEMO_DAILY_LIMIT_GUEST = 5;
export const DEMO_DAILY_LIMIT_USER = 20;
export const DEMO_COST_CREDITS = 1;
export function dailyLimitFor(role: string | undefined): number {
  return role ? DEMO_DAILY_LIMIT_USER : DEMO_DAILY_LIMIT_GUEST;
}
