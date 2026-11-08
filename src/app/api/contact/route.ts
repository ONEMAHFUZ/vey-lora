import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({ name: z.string().min(2).max(120), email: z.string().email(), subject: z.string().min(2).max(200), message: z.string().min(5).max(5000) });
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid message", details: parsed.error.flatten() }, { status: 400 });
  // Persists to SupportTicket via Prisma once DATABASE_URL is configured.
  return NextResponse.json({ error: "Contact messages are not persisted yet: database is not configured." }, { status: 503 });
}
