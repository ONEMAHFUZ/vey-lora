// Server-side usage + credit enforcement (Phase B).
// - Daily allowance comes from the source's PLANS values:
//   FREE 20/day, STARTER 500/day, PRO 2000/day, PREMIUM 10000/day.
//   Signed-out guests get 5/day (existing DEMO_DAILY_LIMIT_GUEST).
// - The check runs BEFORE generation. Credits are deducted ONLY after a
//   verified successful generation; failures record nothing and cost nothing.
// - UsageRecord rows are written when a live database exists. When there is
//   no database (this workspace), an in-memory per-day counter enforces the
//   same limits for the running process — limits still work, they just do
//   not survive a restart. Nothing here ever throws into the request path.
import { PLANS } from "@/data/tools";
import { getPrisma, startOfTodayUtc, todayKeyUtc } from "@/lib/db";

export const DEMO_COST_CREDITS = 1;

/** Daily run allowance per plan tier (from PLANS credits). */
export const DAILY_ALLOWANCE: Record<string, number> = Object.fromEntries(
  PLANS.map((p) => [p.tier, p.credits]),
);
export const GUEST_DAILY_LIMIT = 5;

export interface SessionUser {
  id: string;
  email?: string | null;
  role?: string;
}

/** Signed-in user from the NextAuth session, or null for guests / no DB. */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);
    const u = session?.user as { id?: string; email?: string | null; role?: string } | undefined;
    if (!u?.id) return null;
    return { id: u.id, email: u.email ?? null, role: u.role };
  } catch {
    return null; // No session store / no database yet — treat as guest.
  }
}

interface PrismaLike {
  userSubscription: {
    findFirst(args: {
      where: { userId: string; status: string };
      include: { plan: boolean };
      orderBy: { createdAt: string };
    }): Promise<{ plan?: { tier?: string } | null } | null>;
  };
  usageRecord: {
    count(args: { where: { userId: string; createdAt: { gte: Date } } }): Promise<number>;
    create(args: { data: Record<string, unknown> }): Promise<unknown>;
  };
  creditBalance: {
    findUnique(args: { where: { userId: string } }): Promise<{ balance: number } | null>;
    update(args: {
      where: { userId: string };
      data: { balance: { decrement: number } };
    }): Promise<unknown>;
  };
}

async function getDb(): Promise<PrismaLike | null> {
  try {
    const prisma = (await getPrisma()) as PrismaLike | null;
    return prisma;
  } catch {
    return null;
  }
}

/** Active subscription tier for a user; FREE when none / no database. */
export async function getUserTier(userId: string): Promise<string> {
  try {
    const db = await getDb();
    if (!db) return "FREE";
    const sub = await db.userSubscription.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
    const tier = sub?.plan?.tier;
    return tier && DAILY_ALLOWANCE[tier] !== undefined ? tier : "FREE";
  } catch {
    return "FREE";
  }
}

export function dailyAllowanceFor(tier: string | undefined): number {
  if (!tier) return GUEST_DAILY_LIMIT;
  return DAILY_ALLOWANCE[tier] ?? DAILY_ALLOWANCE.FREE;
}

// ---- In-memory fallback counters (no database yet) -----------------------
// Keyed by user or guest IP + UTC day. Same limits, process-local only.
const memCounts = new Map<string, { day: string; count: number }>();

function memKey(userId: string | null, ip: string): string {
  return userId ? `user:${userId}` : `guest:${ip}`;
}

function memUsed(userId: string | null, ip: string): number {
  const entry = memCounts.get(memKey(userId, ip));
  if (!entry || entry.day !== todayKeyUtc()) return 0;
  return entry.count;
}

function memBump(userId: string | null, ip: string): void {
  const key = memKey(userId, ip);
  const day = todayKeyUtc();
  const entry = memCounts.get(key);
  if (!entry || entry.day !== day) memCounts.set(key, { day, count: 1 });
  else entry.count += 1;
}

export interface LimitCheck {
  allowed: boolean;
  used: number;
  limit: number;
  tier: string;
}

/** Check the daily limit BEFORE generation. Never throws. */
export async function checkDailyLimit(opts: {
  userId: string | null;
  ip: string;
  tier: string;
}): Promise<LimitCheck> {
  const limit = opts.userId ? dailyAllowanceFor(opts.tier) : GUEST_DAILY_LIMIT;
  let used = 0;
  try {
    const db = await getDb();
    if (db && opts.userId) {
      used = await db.usageRecord.count({
        where: { userId: opts.userId, createdAt: { gte: startOfTodayUtc() } },
      });
    } else {
      used = memUsed(opts.userId, opts.ip);
    }
  } catch {
    used = memUsed(opts.userId, opts.ip);
  }
  return { allowed: used < limit, used, limit, tier: opts.tier };
}

export interface RecordUsageInput {
  userId: string | null;
  ip: string;
  demoKey: string;
  provider: string;
  model: string;
  tokens: number;
  /** USD cost of this run. $0 on the free tiers. */
  costUsd: number;
}

/**
 * Record a VERIFIED successful run: one UsageRecord row (when a database
 * exists) and, when the user has a CreditBalance row, deduct 1 credit.
 * Failures here never fail the request — usage is best-effort logging.
 */
export async function recordUsage(input: RecordUsageInput): Promise<void> {
  memBump(input.userId, input.ip);
  try {
    const db = await getDb();
    if (!db) return;
    await db.usageRecord.create({
      data: {
        userId: input.userId,
        demoKey: input.demoKey,
        provider: input.provider,
        model: input.model,
        tokens: input.tokens,
        costUsd: input.costUsd,
      },
    });
    if (input.userId) {
      const balance = await db.creditBalance.findUnique({ where: { userId: input.userId } });
      if (balance && balance.balance >= DEMO_COST_CREDITS) {
        await db.creditBalance.update({
          where: { userId: input.userId },
          data: { balance: { decrement: DEMO_COST_CREDITS } },
        });
      }
    }
  } catch (e) {
    console.warn("[vey-lora] usage record failed (non-fatal):", e instanceof Error ? e.message : e);
  }
}
