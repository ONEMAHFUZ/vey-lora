import { NextResponse } from "next/server";
import { SAMPLE_TOOLS } from "@/data/tools";
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const tool = SAMPLE_TOOLS.find((t) => t.slug === params.slug);
  if (!tool) return NextResponse.json({ error: "Tool not found" }, { status: 404 });
  return NextResponse.json({ ...tool, sample: true });
}
