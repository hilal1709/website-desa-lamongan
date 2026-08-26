import type { MetadataRoute } from "next"
import { getSiteSettings } from "@/lib/site-settings"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings()
  const base = settings.siteUrl || "http://localhost:3000"
  return { rules: settings.allowIndexing ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/api", "/maintenance"] }] : [{ userAgent: "*", disallow: "/" }], sitemap: `${base}/sitemap.xml` }
}
