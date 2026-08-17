import { prisma } from "@/app/lib/prisma"
import { unstable_cache } from "next/cache"

const getCachedHomeData = unstable_cache(async () => {
  try {
    const [statistics, services, news, documents] = await Promise.all([
      prisma.statistic.findMany({ orderBy: { order: "asc" }, take: 4 }),
      prisma.quickService.findMany({ orderBy: { order: "asc" }, take: 4 }),
      prisma.news.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
      prisma.document.findMany({ orderBy: { uploadedAt: "desc" }, take: 2 }),
    ])

    return { statistics, services, news, documents }
  } catch {
    return { statistics: [], services: [], news: [], documents: [] }
  }
}, ["home-data"], { revalidate: 300, tags: ["home-data"] })

export async function getHomeData() {
  return getCachedHomeData()
}
