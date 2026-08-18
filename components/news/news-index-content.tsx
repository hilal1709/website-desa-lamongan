import { EmptyNewsState } from "@/components/news/empty-news-state"
import { FeaturedNewsCard } from "@/components/news/featured-news-card"
import { NewsFilterForm } from "@/components/news/news-filter-form"
import { NewsGrid } from "@/components/news/news-grid"
import { NewsMotion } from "@/components/news/news-motion"
import { NewsPagination } from "@/components/news/news-pagination"
import { PopularNews } from "@/components/news/popular-news"
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
  const popularArticles = [featuredArticle, ...articles].filter((article): article is NewsArticle => Boolean(article))

  return (
    <NewsMotion>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        {featuredArticle ? (
          <section aria-labelledby="featured-news-heading" className="news-top-stories grid gap-7 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div><p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-emerald-800">Headline hari ini</p><h2 id="featured-news-heading" className="sr-only">Berita utama</h2><FeaturedNewsCard article={featuredArticle} /></div>
            <PopularNews articles={popularArticles} />
          </section>
        ) : null}

        <div className={featuredArticle ? "mt-10 sm:mt-12" : ""}><NewsFilterForm categories={categories} query={query} category={category} /></div>

        {articles.length ? (
          <section aria-labelledby="latest-news-heading" className="mt-10 sm:mt-12">
            <div className="news-section-divider news-section-intro flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Arsip pilihan</p><h2 id="latest-news-heading" className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{hasActiveFilters ? "Hasil pencarian" : "Berita terbaru"}</h2></div>
              <p className="text-sm text-slate-500">{resultCount} {resultCount === 1 ? "cerita ditemukan" : "cerita ditemukan"}</p>
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
