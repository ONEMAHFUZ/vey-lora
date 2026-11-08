import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SAMPLE_TOOLS } from "@/data/tools";

// Public tool listing with pagination + search + filters.
// Backed by SAMPLE_TOOLS until Prisma/DB is connected; swap the source to
// prisma.aITool.findMany with the same query params (see QA_REPORT.md).
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get("q") || "").toLowerCase();
  const category = sp.get("category") || "";
  const pricing = sp.get("pricing") || "";
  const page = Math.max(1, Number(sp.get("page") || 1));
  const perPage = Math.min(50, Math.max(1, Number(sp.get("perPage") || 12)));
  const filtered = SAMPLE_TOOLS.filter((t) =>
    (!q || (t.name + t.description + t.category).toLowerCase().includes(q)) &&
    (!category || t.category === category) && (!pricing || t.pricing === pricing));
  const items = filtered.slice((page - 1) * perPage, page * perPage);
  return NextResponse.json({ items, total: filtered.length, page, perPage, sample: true });
}

const submitSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  category: z.string().min(2).max(80),
  websiteUrl: z.string().url().optional().or(z.literal("")),
});

// Creator submission intake (validated). Persists to ToolSubmission via Prisma
// once DATABASE_URL is configured; until then it returns 503 honestly.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission", details: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ error: "Tool submissions are not persisted yet: database is not configured. Set DATABASE_URL and run migrations." }, { status: 503 });
}
