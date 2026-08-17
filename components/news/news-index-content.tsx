import { EmptyNewsState } from "@/components/news/empty-news-state"
import { FeaturedNewsCard } from "@/components/news/featured-news-card"
import { NewsFilterForm } from "@/components/news/news-filter-form"
import { NewsGrid } from "@/components/news/news-grid"
import { NewsMotion } from "@/components/news/news-motion"
import { NewsPagination } from "@/components/news/news-pagination"
import type { NewsArticle } from "@/types"

interface NewsIndexContentProps {
  featuredArticle: NewsArticle | null
  articles: NewsArticle[]
  categories: string[]
  query: string
  category: string
  resultCount: number
  page: number
  totalPages: number
}

export function NewsIndexContent({ featuredArticle, articles, categories, query, category, resultCount, page, totalPages }: NewsIndexContentProps) {
  const hasNews = Boolean(featuredArticle || articles.length)
  const hasActiveFilters = Boolean(query || category)

  return (
    <NewsMotion>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <NewsFilterForm categories={categories} query={query} category={category} />
        {featuredArticle ? (
          <section aria-labelledby="featured-news-heading" className="mt-8 sm:mt-10">
            <h2 id="featured-news-heading" className="sr-only">Berita unggulan</h2>
            <FeaturedNewsCard article={featuredArticle} />
          </section>
        ) : null}

        {articles.length ? (
          <section aria-labelledby="latest-news-heading" className={featuredArticle ? "mt-10 sm:mt-12" : "mt-8 sm:mt-10"}>
            <div className="news-section-divider flex items-center gap-3 sm:gap-4">
              <div aria-hidden="true" className="h-px flex-1 bg-slate-200" />
              <h2 id="latest-news-heading" className="shrink-0 text-xs font-bold uppercase tracking-[.12em] text-slate-500 sm:text-sm sm:tracking-[.14em]">{hasActiveFilters ? `${resultCount} hasil ditemukan` : "Berita lainnya"}</h2>
              <div aria-hidden="true" className="h-px flex-1 bg-slate-200" />
            </div>
            <NewsGrid articles={articles} className="mt-8 sm:mt-10" />
            <NewsPagination currentPage={page} totalPages={totalPages} query={query} category={category} />
          </section>
        ) : null}

        {!hasNews ? <section aria-label="Status berita" className="mt-8 sm:mt-10"><EmptyNewsState title={hasActiveFilters ? "Berita tidak ditemukan" : undefined} description={hasActiveFilters ? "Coba gunakan kata kunci atau kategori lain." : undefined} /></section> : null}
      </div>
    </NewsMotion>
  )
}
