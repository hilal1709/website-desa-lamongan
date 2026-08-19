import { prisma } from "@/app/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export type CmsNewsArticle = { id: string; title: string; slug: string; excerpt: string; content: string; image: string; category: string; published: boolean; createdAt: string }
export type CmsNewsData = { categories: string[]; articles: CmsNewsArticle[] }

const initial: CmsNewsData = { categories: ["Pembangunan", "Pertanian", "Kesehatan"], articles: [] }

async function readNews(): Promise<CmsNewsData> {
  try {
    const store = await prisma.cmsNewsStore?.findUnique({ where: { id: 1 } })
    if (!store) {
      await prisma.cmsNewsStore?.create({ data: { id: 1, data: initial as unknown as Prisma.InputJsonValue } })
      return initial
    }

    const data = store.data as Partial<CmsNewsData>
    return {
      categories: Array.isArray(data.categories) ? data.categories : initial.categories,
      articles: Array.isArray(data.articles) ? data.articles : initial.articles,
    }
  } catch {
    return initial
  }
}
// News is public CMS content. Keep the read uncached so a router refresh from
// the CMS notification immediately reflects the successful database write.
export const getCmsNews = () => readNews()
export const getFreshCmsNews = () => readNews()
export async function saveCmsNews(data: CmsNewsData) { await prisma.cmsNewsStore.upsert({ where: { id: 1 }, create: { id: 1, data: data as unknown as Prisma.InputJsonValue }, update: { data: data as unknown as Prisma.InputJsonValue } }) }
