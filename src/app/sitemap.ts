import type { MetadataRoute } from "next";
import { SAMPLE_TOOLS } from "@/data/tools";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const staticPages = ["", "/explore", "/categories", "/pricing", "/about", "/blog", "/contact", "/faq", "/privacy", "/terms", "/demo"];
  return [
    ...staticPages.map((p) => ({ url: base + p, lastModified: new Date() })),
    ...SAMPLE_TOOLS.map((t) => ({ url: `${base}/tools/${t.slug}`, lastModified: new Date() })),
  ];
}
