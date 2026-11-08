// Admin-configurable provider/model selection.
// Stored in the database (Prisma ProviderConfig, key "primary") once a live
// database exists; until then it falls back to server-side env vars.
// API KEYS ARE NEVER STORED HERE and never accepted by the admin API —
// keys live only in server env vars (GEMINI_API_KEY, GROQ_API_KEY).
import { getPrisma } from "@/lib/db";

export type ProviderName = "gemini" | "groq" | "local-demo";

export interface ProviderConfigData {
  primaryProvider: ProviderName;
  primaryModel?: string;
  fallbackProvider?: ProviderName;
  fallbackModel?: string;
  /** Daily runs allowed for signed-out guests. */
  dailyLimitGuest: number;
}

export const DEFAULT_PROVIDER_CONFIG: ProviderConfigData = {
  primaryProvider: "gemini",
  fallbackProvider: "groq",
  dailyLimitGuest: 5,
};

interface ProviderConfigRow {
  primaryProvider: string;
  primaryModel: string | null;
  fallbackProvider: string | null;
  fallbackModel: string | null;
  dailyLimitGuest: number;
}

interface PrismaLike {
  providerConfig: {
    findUnique(args: { where: { key: string } }): Promise<ProviderConfigRow | null>;
    upsert(args: {
      where: { key: string };
      update: Record<string, unknown>;
      create: Record<string, unknown>;
    }): Promise<ProviderConfigRow>;
  };
}

function isProviderName(v: string | undefined): v is ProviderName {
  return v === "gemini" || v === "groq" || v === "local-demo";
}

/** Env-only config (used when no database row exists). */
export function envProviderConfig(): ProviderConfigData {
  const order = (process.env.AI_PROVIDER_ORDER || "gemini,groq")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(isProviderName);
  const primary = isProviderName(process.env.AI_PROVIDER?.toLowerCase())
    ? (process.env.AI_PROVIDER!.toLowerCase() as ProviderName)
    : order[0] ?? "gemini";
  const fallback = order.find((p) => p !== primary) ?? (primary === "gemini" ? "groq" : "gemini");
  const guest = Number(process.env.DEMO_DAILY_LIMIT_GUEST || "5");
  return {
    primaryProvider: primary,
    fallbackProvider: fallback,
    dailyLimitGuest: Number.isFinite(guest) && guest > 0 ? Math.floor(guest) : 5,
  };
}

/** Ordered provider list the router tries: [primary, fallback]. */
export function providerOrderFromConfig(cfg: ProviderConfigData): ProviderName[] {
  const order: ProviderName[] = [cfg.primaryProvider];
  if (cfg.fallbackProvider && cfg.fallbackProvider !== cfg.primaryProvider) {
    order.push(cfg.fallbackProvider);
  }
  return order;
}

// DB-backed config is cached briefly (60s) to avoid a DB hit per request.
// Env-only config is computed fresh every call (cheap, and picks up deploys).
let dbCache: { at: number; cfg: ProviderConfigData } | null = null;

function rowToConfig(row: ProviderConfigRow): ProviderConfigData {
  return {
    primaryProvider: isProviderName(row.primaryProvider) ? row.primaryProvider : "gemini",
    primaryModel: row.primaryModel ?? undefined,
    fallbackProvider: row.fallbackProvider && isProviderName(row.fallbackProvider)
      ? row.fallbackProvider
      : undefined,
    fallbackModel: row.fallbackModel ?? undefined,
    dailyLimitGuest: row.dailyLimitGuest > 0 ? row.dailyLimitGuest : 5,
  };
}

/** Current provider config: DB row wins, env vars are the fallback. */
export async function getProviderConfig(): Promise<ProviderConfigData> {
  if (dbCache && Date.now() - dbCache.at < 60_000) return dbCache.cfg;
  try {
    const prisma = (await getPrisma()) as PrismaLike | null;
    const row = await prisma?.providerConfig.findUnique({ where: { key: "primary" } });
    if (row) {
      const cfg = rowToConfig(row);
      dbCache = { at: Date.now(), cfg };
      return cfg;
    }
  } catch {
    // No live database — fall through to env config.
  }
  return envProviderConfig();
}

/** Admin-only write. Throws when no live database is available. */
export async function setProviderConfig(
  patch: Partial<ProviderConfigData>,
  updatedBy?: string,
): Promise<ProviderConfigData> {
  const prisma = (await getPrisma()) as PrismaLike | null;
  if (!prisma) {
    throw new Error(
      "Provider settings need a live database: set DATABASE_URL and run prisma migrate first.",
    );
  }
  const current = await getProviderConfig();
  const next: ProviderConfigData = {
    primaryProvider: patch.primaryProvider ?? current.primaryProvider,
    primaryModel: patch.primaryModel ?? current.primaryModel,
    fallbackProvider: patch.fallbackProvider ?? current.fallbackProvider,
    fallbackModel: patch.fallbackModel ?? current.fallbackModel,
    dailyLimitGuest: patch.dailyLimitGuest ?? current.dailyLimitGuest,
  };
  if (!isProviderName(next.primaryProvider)) {
    throw new Error(`Unknown provider: ${next.primaryProvider}`);
  }
  if (next.fallbackProvider && !isProviderName(next.fallbackProvider)) {
    throw new Error(`Unknown provider: ${next.fallbackProvider}`);
  }
  const row = await prisma.providerConfig.upsert({
    where: { key: "primary" },
    update: {
      primaryProvider: next.primaryProvider,
      primaryModel: next.primaryModel ?? null,
      fallbackProvider: next.fallbackProvider ?? null,
      fallbackModel: next.fallbackModel ?? null,
      dailyLimitGuest: next.dailyLimitGuest,
      updatedBy: updatedBy ?? null,
    },
    create: {
      key: "primary",
      primaryProvider: next.primaryProvider,
      primaryModel: next.primaryModel ?? null,
      fallbackProvider: next.fallbackProvider ?? null,
      fallbackModel: next.fallbackModel ?? null,
      dailyLimitGuest: next.dailyLimitGuest,
      updatedBy: updatedBy ?? null,
    },
  });
  const cfg = rowToConfig(row);
  dbCache = { at: Date.now(), cfg };
  return cfg;
}
