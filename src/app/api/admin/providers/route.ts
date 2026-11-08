import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getProviderConfig, setProviderConfig } from "@/lib/providers/config";
import { getSessionUser } from "@/lib/usage";

// Admin-only provider settings. API KEYS ARE NEVER ACCEPTED OR RETURNED
// HERE — keys live only in server env vars (GEMINI_API_KEY, GROQ_API_KEY).
// Admin role is verified from the session; without a live database/session
// store the route returns 503 instead of guessing.

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) return { ok: false as const, status: 401 as const, error: "Sign in as an admin first." };
  try {
    const { isAdmin } = await import("@/lib/auth");
    if (!isAdmin(user.role)) {
      return { ok: false as const, status: 403 as const, error: "Admin role required." };
    }
    return { ok: true as const, user };
  } catch {
    return {
      ok: false as const,
      status: 503 as const,
      error: "Admin verification needs a live database: set DATABASE_URL and run prisma migrate first.",
    };
  }
}

const updateSchema = z.object({
  primaryProvider: z.enum(["gemini", "groq", "local-demo"]).optional(),
  primaryModel: z.string().min(1).max(120).optional().nullable(),
  fallbackProvider: z.enum(["gemini", "groq", "local-demo"]).optional().nullable(),
  fallbackModel: z.string().min(1).max(120).optional().nullable(),
  dailyLimitGuest: z.number().int().min(0).max(1000).optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const cfg = await getProviderConfig();
  return NextResponse.json({
    config: cfg,
    note: "API keys are configured only via server env vars (GEMINI_API_KEY, GROQ_API_KEY) and are never shown here.",
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settings", details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const cfg = await setProviderConfig(
      {
        primaryProvider: parsed.data.primaryProvider,
        primaryModel: parsed.data.primaryModel ?? undefined,
        fallbackProvider: parsed.data.fallbackProvider ?? undefined,
        fallbackModel: parsed.data.fallbackModel ?? undefined,
        dailyLimitGuest: parsed.data.dailyLimitGuest,
      },
      auth.user.id,
    );
    return NextResponse.json({ config: cfg });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save provider settings." },
      { status: 503 },
    );
  }
}
