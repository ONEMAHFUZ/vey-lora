import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({ email: z.string().email() });
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  // Persists to NewsletterSubscriber via Prisma once DATABASE_URL is configured.
  return NextResponse.json({ error: "Newsletter signup is not persisted yet: database is not configured." }, { status: 503 });
}
