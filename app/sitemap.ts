import type { MetadataRoute } from "next"
import { getCmsNews } from "@/lib/news-cms"
import { getSiteSettings } from "@/lib/site-settings"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, news] = await Promise.all([getSiteSettings(), getCmsNews()])
  const base = settings.siteUrl || "http://localhost:3000"
  const pages = ["/", "/profil", "/profil/struktur-perangkat-desa", "/layanan", "/berita", "/arsip", "/aduan", "/infografis", "/peta-bencana"]
  return [...pages.map((path) => ({ url: `${base}${path}`, lastModified: new Date() })), ...news.articles.filter((article) => article.published && article.slug).map((article) => ({ url: `${base}/berita/${article.slug}`, lastModified: new Date(article.createdAt) }))]
}
