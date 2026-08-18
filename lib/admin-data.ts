import { prisma } from "@/app/lib/prisma"
import type { CmsNewsData } from "@/lib/news-cms"
import { unstable_cache } from "next/cache"

export type AdminMetric = {
  key: "complaints" | "population" | "content" | "umkm"
  value: string
  label: string
  detail: string
}

export type AdminQueueItem = { id: string; title: string; meta: string; status: string }

const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value)
const formatDateTime = (date: Date) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date)

async function readAdminDashboardData(): Promise<{ metrics: AdminMetric[]; queue: AdminQueueItem[]; updatedAt: string | null }> {
  try {
    const [complaints, allComplaints, population, businesses, newsStore, pageStore] = await Promise.all([
      prisma.complaint.findMany({ where: { status: { notIn: ["Selesai", "Ditutup"] } }, orderBy: { updatedAt: "desc" }, take: 8, select: { id: true, title: true, category: true, location: true, status: true, createdAt: true } }),
      prisma.complaint.count({ where: { status: { notIn: ["Selesai", "Ditutup"] } } }),
      prisma.statistic.findFirst({ where: { label: { contains: "penduduk", mode: "insensitive" } }, orderBy: { order: "asc" }, select: { value: true, label: true } }),
      prisma.umkm.count({ where: { isPublished: true } }),
      prisma.cmsNewsStore.findUnique({ where: { id: 1 }, select: { data: true, updatedAt: true } }),
      prisma.cmsPageStore.findUnique({ where: { id: 1 }, select: { updatedAt: true } }),
    ])

    const news = newsStore?.data as Partial<CmsNewsData> | undefined
    const articles = Array.isArray(news?.articles) ? news.articles : []
    const publishedArticles = articles.filter((article) => article.published)
    const drafts = articles.filter((article) => !article.published)
    const populationValue = population?.value?.trim() || "—"
    const populationDetail = population ? population.label : "Belum ada statistik penduduk"
    const queue: AdminQueueItem[] = [
      ...complaints.map((item) => ({ id: `complaint-${item.id}`, title: item.title, meta: `${item.category} · ${item.location} · ${formatDateTime(item.createdAt)}`, status: item.status })),
      ...drafts.map((item) => ({ id: `draft-${item.id}`, title: item.title || "Artikel tanpa judul", meta: `${item.category || "Tanpa kategori"} · Diperbarui ${formatDateTime(new Date(item.createdAt))}`, status: "Draft" })),
    ].slice(0, 8)

    const newestUpdate = [newsStore?.updatedAt, pageStore?.updatedAt].filter((date): date is Date => Boolean(date)).sort((a, b) => b.getTime() - a.getTime())[0]
    return {
      metrics: [
        { key: "complaints", value: formatNumber(allComplaints), label: "Aduan aktif", detail: complaints.length ? "Memerlukan tindak lanjut" : "Tidak ada aduan terbuka" },
        { key: "population", value: populationValue, label: "Warga terdata", detail: populationDetail },
        { key: "content", value: formatNumber(publishedArticles.length), label: "Konten dipublikasikan", detail: `${formatNumber(drafts.length)} draft berita` },
        { key: "umkm", value: formatNumber(businesses), label: "UMKM aktif", detail: "Tampil di katalog publik" },
      ],
      queue,
      updatedAt: newestUpdate ? formatDateTime(newestUpdate) : null,
    }
  } catch {
    return { metrics: [], queue: [], updatedAt: null }
  }
}

const getCachedAdminDashboardData = unstable_cache(readAdminDashboardData, ["admin-dashboard"], {
  revalidate: 30,
  tags: ["admin-dashboard"],
})

export async function getAdminDashboardData() {
  return getCachedAdminDashboardData()
}
