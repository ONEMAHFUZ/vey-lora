import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateText, getConfiguredProviders } from "@/lib/providers/router";
import { LIMIT_REACHED_MESSAGE, ProviderError } from "@/lib/providers/types";
import {
  checkDailyLimit,
  getSessionUser,
  getUserTier,
  recordUsage,
  DEMO_COST_CREDITS,
} from "@/lib/usage";

// In-memory per-IP rate limit (demo only — use Redis/DB in production).
const hits = new Map<string, { count: number; resetAt: number }>();
const DEMO_KEYS = ["chat-assistant", "text-writer", "summarizer", "translator", "title-generator", "code-explainer"] as const;
const schema = z.object({ input: z.string().min(1).max(5000), prompt: z.string().max(500).optional() });

/** Provider availability + daily limits (no keys are ever returned). */
export async function GET() {
  return NextResponse.json({
    providers: getConfiguredProviders(),
    demoKeys: DEMO_KEYS,
    note: "Live providers need server-side GEMINI_API_KEY / GROQ_API_KEY. Without keys the labelled local demo runs.",
  });
}

export async function POST(req: NextRequest, { params }: { params: { tool: string } }) {
  if (!DEMO_KEYS.includes(params.tool as never)) return NextResponse.json({ error: "Unknown demo" }, { status: 404 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) hits.set(ip, { count: 1, resetAt: now + 60_000 });
  else if (entry.count >= 10) return NextResponse.json({ error: "Rate limit: max 10 demo requests per minute." }, { status: 429 });
  else entry.count += 1;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

  // Server-side credit check BEFORE generation (per-user daily limit).
  const user = await getSessionUser();
  const tier = user ? await getUserTier(user.id) : "GUEST";
  const limit = await checkDailyLimit({ userId: user?.id ?? null, ip, tier });
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `${LIMIT_REACHED_MESSAGE} (used ${limit.used}/${limit.limit} today, plan: ${tier})`,
        dailyLimit: limit.limit,
        creditsUsedToday: limit.used,
        creditsRemaining: 0,
        tier,
      },
      { status: 429 },
    );
  }

  try {
    const result = await generateText({
      prompt: parsed.data.prompt || "",
      input: parsed.data.input,
      demoKey: params.tool,
    });
    // Deduct/record ONLY after verified successful generation.
    await recordUsage({
      userId: user?.id ?? null,
      ip,
      demoKey: params.tool,
      provider: result.provider,
      model: result.model,
      tokens: result.tokensUsed ?? 0,
      costUsd: 0, // $0 on the Gemini/Groq free tiers
    });
    const usedToday = limit.used + DEMO_COST_CREDITS;
    return NextResponse.json({
      output: result.output,
      provider: result.provider,
      model: result.model,
      isLocalDemo: result.isLocalDemo,
      tokensUsed: result.tokensUsed ?? 0,
      dailyLimit: limit.limit,
      creditsUsedToday: usedToday,
      creditsRemaining: Math.max(0, limit.limit - usedToday),
      tier,
    });
  } catch (e) {
    if (e instanceof ProviderError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "AI provider error. Your credits were not used." }, { status: 503 });
  }
}
