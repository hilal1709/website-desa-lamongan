import type { CmsNewsArticle } from "@/lib/news-cms"

export const ARTICLES_PER_PAGE = 8

export function makeNewsSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function createEmptyArticle(): CmsNewsArticle {
  return {
    id: crypto.randomUUID(),
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    published: true,
    createdAt: new Date().toISOString(),
  }
}

export function formatArticleDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}
