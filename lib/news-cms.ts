import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import { unstable_cache } from "next/cache"

export type CmsNewsArticle = { id: string; title: string; slug: string; excerpt: string; content: string; image: string; category: string; published: boolean; createdAt: string }
export type CmsNewsData = { categories: string[]; articles: CmsNewsArticle[] }

const filePath = path.join(process.cwd(), "data", "cms-news.json")
const initial: CmsNewsData = { categories: ["Pembangunan", "Pertanian", "Kesehatan"], articles: [] }

async function readNews(): Promise<CmsNewsData> {
  try { return { ...initial, ...(JSON.parse(await fs.readFile(filePath, "utf8")) as CmsNewsData) } } catch { return initial }
}
const cachedNews = unstable_cache(readNews, ["cms-news"], { tags: ["cms-news"], revalidate: 300 })
export const getCmsNews = () => cachedNews()
export const getFreshCmsNews = () => readNews()
export async function saveCmsNews(data: CmsNewsData) { await fs.mkdir(path.dirname(filePath), { recursive: true }); await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8") }
export const createNewsId = () => randomUUID()
export function makeSlug(title: string) { return title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") }
