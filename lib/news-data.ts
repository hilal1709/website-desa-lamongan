import { getCmsNews } from "@/lib/news-cms"
import type { NewsArticle } from "@/types"

export interface NewsPageData {
  featured: NewsArticle | null
  articles: NewsArticle[]
  count: number
  categories: string[]
  page: number
  totalPages: number
}

export interface NewsFilters {
  query?: string
  category?: string
  page?: number
}

const articlesPerPage = 10

export async function getNewsPageData({ query = "", category = "", page = 1 }: NewsFilters = {}): Promise<NewsPageData> {
  const data = await getCmsNews()
  const normalizedQuery = query.trim().toLocaleLowerCase("id-ID")
  const normalizedCategory = category.trim()
  const allArticles = (data.articles ?? [])
    .filter((article) => article.published)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((article) => ({ id: article.id, title: article.title, slug: article.slug, excerpt: article.excerpt, content: article.content, image_url: article.image || null, category: article.category, published: article.published, created_at: article.createdAt } satisfies NewsArticle))
  const matchingArticles = allArticles.filter((article) => {
    const searchTarget = `${article.title} ${article.excerpt ?? ""} ${article.content ?? ""}`.toLocaleLowerCase("id-ID")
    return (!normalizedQuery || searchTarget.includes(normalizedQuery)) && (!normalizedCategory || article.category === normalizedCategory)
  })
  const categories = Array.from(new Set([...(data.categories ?? []), ...allArticles.map((article) => article.category).filter((item): item is string => Boolean(item))])).sort((a, b) => a.localeCompare(b, "id-ID"))
  const totalPages = Math.max(1, Math.ceil(Math.max(matchingArticles.length - 1, 0) / articlesPerPage))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const startIndex = 1 + (currentPage - 1) * articlesPerPage

  return {
    featured: currentPage === 1 ? matchingArticles[0] ?? null : null,
    articles: matchingArticles.slice(startIndex, startIndex + articlesPerPage),
    count: matchingArticles.length,
    categories,
    page: currentPage,
    totalPages,
  }
}
