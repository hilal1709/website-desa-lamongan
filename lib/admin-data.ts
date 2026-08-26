import { prisma } from "@/app/lib/prisma"
import type { CmsNewsData } from "@/lib/news-cms"
import { unstable_cache } from "next/cache"

export type AdminMetricKey = "complaints" | "population" | "content" | "umkm" | "services"
export type AdminMetric = { key: AdminMetricKey; value: string; label: string; detail: string; href: string }
export type AdminWorkItem = { id: string; title: string; meta: string; status: string }
export type AdminQueueItem = AdminWorkItem
export type AdminAttentionGroup = { key: "complaints" | "services" | "drafts"; label: string; description: string; count: number; href: string; items: AdminWorkItem[] }
export type AdminActivity = { key: "complaints" | "services" | "news"; label: string; value: number; color: "amber" | "emerald" | "sky" }

const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value)
const formatDateTime = (date: Date) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date)
const isInLastThirtyDays = (value: string, since: Date) => {
  const date = new Date(value)
  return !Number.isNaN(date.getTime()) && date >= since
}

async function readAdminDashboardData(): Promise<{ metrics: AdminMetric[]; attention: AdminAttentionGroup[]; activity: AdminActivity[]; queue: AdminQueueItem[]; updatedAt: string | null }> {
  try {
    const since = new Date()
    since.setDate(since.getDate() - 29)
    since.setHours(0, 0, 0, 0)

    const [openComplaints, complaintCount, recentComplaintCount, population, businesses, openSubmissions, submissionCount, recentSubmissionCount, newsStore, pageStore] = await Promise.all([
      prisma.complaint.findMany({ where: { status: { notIn: ["Selesai", "Ditutup"] } }, orderBy: { updatedAt: "desc" }, take: 3, select: { id: true, title: true, category: true, location: true, status: true, createdAt: true } }),
      prisma.complaint.count({ where: { status: { notIn: ["Selesai", "Ditutup"] } } }),
      prisma.complaint.count({ where: { createdAt: { gte: since } } }),
      // Older deployments may not have the optional Statistic table yet. Its
      // absence must not hide operational data such as complaints.
      prisma.statistic.findFirst({ where: { label: { contains: "penduduk", mode: "insensitive" } }, orderBy: { order: "asc" }, select: { value: true, label: true } }).catch(() => null),
      prisma.umkm.count({ where: { isPublished: true } }),
      prisma.serviceSubmission.findMany({ where: { status: { notIn: ["SELESAI", "DITOLAK"] } }, orderBy: { updatedAt: "desc" }, take: 3, select: { id: true, trackingCode: true, status: true, createdAt: true, service: { select: { title: true } } } }),
      prisma.serviceSubmission.count({ where: { status: { notIn: ["SELESAI", "DITOLAK"] } } }),
      prisma.serviceSubmission.count({ where: { createdAt: { gte: since } } }),
      prisma.cmsNewsStore.findUnique({ where: { id: 1 }, select: { data: true, updatedAt: true } }),
      prisma.cmsPageStore.findUnique({ where: { id: 1 }, select: { updatedAt: true } }),
    ])

    const news = newsStore?.data as Partial<CmsNewsData> | undefined
    const articles = Array.isArray(news?.articles) ? news.articles : []
    const publishedArticles = articles.filter((article) => article.published)
    const drafts = articles.filter((article) => !article.published)
    const recentlyPublishedCount = publishedArticles.filter((article) => isInLastThirtyDays(article.publishedAt ?? article.createdAt, since)).length
    const populationValue = population?.value?.trim() || "—"
    const populationDetail = population ? population.label : "Belum ada statistik penduduk"
    const attention: AdminAttentionGroup[] = [
      { key: "complaints", label: "Aduan aktif", description: "Laporan warga yang belum selesai.", count: complaintCount, href: "/admin/aduan", items: openComplaints.map((item) => ({ id: item.id, title: item.title, meta: `${item.category} · ${item.location} · ${formatDateTime(item.createdAt)}`, status: item.status })) },
      { key: "services", label: "Pengajuan aktif", description: "Pengajuan administrasi yang masih diproses.", count: submissionCount, href: "/admin/layanan", items: openSubmissions.map((item) => ({ id: item.id, title: item.service.title, meta: `${item.trackingCode} · ${formatDateTime(item.createdAt)}`, status: item.status.replaceAll("_", " ") })) },
      { key: "drafts", label: "Draft berita", description: "Artikel yang belum dipublikasikan.", count: drafts.length, href: "/admin/berita", items: drafts.slice(0, 3).map((item) => ({ id: item.id, title: item.title || "Artikel tanpa judul", meta: item.category || "Tanpa kategori", status: "Draft" })) },
    ]
    const newestUpdate = [newsStore?.updatedAt, pageStore?.updatedAt].filter((date): date is Date => Boolean(date)).sort((a, b) => b.getTime() - a.getTime())[0]
    return {
      metrics: [
        { key: "complaints", value: formatNumber(complaintCount), label: "Aduan aktif", detail: complaintCount ? "Memerlukan tindak lanjut" : "Tidak ada aduan terbuka", href: "/admin/aduan" },
        { key: "population", value: populationValue, label: "Warga terdata", detail: populationDetail, href: "/admin/infografis" },
        { key: "content", value: formatNumber(publishedArticles.length), label: "Konten dipublikasikan", detail: `${formatNumber(drafts.length)} draft berita`, href: "/admin/berita" },
        { key: "umkm", value: formatNumber(businesses), label: "UMKM aktif", detail: "Tampil di katalog publik", href: "/admin/umkm" },
        { key: "services", value: formatNumber(submissionCount), label: "Pengajuan aktif", detail: "Layanan administrasi warga", href: "/admin/layanan" },
      ],
      attention,
      queue: attention.flatMap((group) => group.items).slice(0, 9),
      activity: [
        { key: "complaints", label: "Aduan masuk", value: recentComplaintCount, color: "amber" },
        { key: "services", label: "Pengajuan masuk", value: recentSubmissionCount, color: "emerald" },
        { key: "news", label: "Berita terbit", value: recentlyPublishedCount, color: "sky" },
      ],
      updatedAt: newestUpdate ? formatDateTime(newestUpdate) : null,
    }
  } catch (error) {
    console.error("Admin dashboard data could not be loaded", error)
    return { metrics: [], attention: [], activity: [], queue: [], updatedAt: null }
  }
}

// Version the cache key whenever the response shape changes. This avoids old
// development or deployed cache entries being rendered with new dashboard UI.
const getCachedAdminDashboardData = unstable_cache(readAdminDashboardData, ["admin-dashboard-v2"], { revalidate: 30, tags: ["admin-dashboard"] })
export async function getAdminDashboardData() { return getCachedAdminDashboardData() }
