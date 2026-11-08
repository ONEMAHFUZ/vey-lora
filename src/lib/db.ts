// Lazy Prisma access. The Prisma client is NOT generated in this workspace
// (prisma generate fails here on ECONNRESET) and no DATABASE_URL is set,
// so importing "@/lib/prisma" at module scope would throw and take down
// any route that imports it. Every DB access in Phase B goes through
// getPrisma() and degrades gracefully to in-memory fallbacks when it
// returns null. On a machine with a generated client + live database,
// this returns the real singleton.
export async function getPrisma(): Promise<unknown | null> {
  try {
    const mod = await import("@/lib/prisma");
    const client =
      (mod as { prisma?: unknown }).prisma ?? (mod as { default?: unknown }).default ?? null;
    return client;
  } catch {
    return null;
  }
}

/** Start of the current UTC day — daily limits reset at midnight UTC. */
export function startOfTodayUtc(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** "YYYY-MM-DD" UTC day key for in-memory fallback counters. */
export function todayKeyUtc(): string {
  return new Date().toISOString().slice(0, 10);
}
