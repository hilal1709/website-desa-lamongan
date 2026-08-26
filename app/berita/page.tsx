import { NewsIndexContent } from "@/components/news/news-index-content"
import { NewsPageHeader } from "@/components/news/news-page-header"
import { getNewsPageData } from "@/lib/news-data"
import { parseNewsFilters, type NewsSearchParams } from "@/lib/news-routing"
import { newsIndexMetadata } from "@/lib/news-seo"

export const metadata = newsIndexMetadata

interface BeritaPageProps {
  searchParams: Promise<NewsSearchParams>
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const params = await searchParams
  const { query, category, page: requestedPage } = parseNewsFilters(params)
  const { featured: featuredArticle, articles, count, categories, page, totalPages } = await getNewsPageData({ query, category, page: requestedPage })
  const hasActiveFilters = Boolean(query || category)

  return <>
    <NewsPageHeader articleCount={count} hasActiveFilters={hasActiveFilters} categories={categories} activeCategory={category} />
    <NewsIndexContent featuredArticle={featuredArticle} articles={articles} query={query} category={category} resultCount={count} page={page} totalPages={totalPages} />
  </>
}
