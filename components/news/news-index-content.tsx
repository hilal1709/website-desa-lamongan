import { EmptyNewsState } from "@/components/news/empty-news-state"
import { FeaturedNewsCard } from "@/components/news/featured-news-card"
import { NewsGrid } from "@/components/news/news-grid"
import { NewsMotion } from "@/components/news/news-motion"
import type { NewsArticle } from "@/types"

interface NewsIndexContentProps {
  featuredArticle: NewsArticle | null
  articles: NewsArticle[]
}

export function NewsIndexContent({ featuredArticle, articles }: NewsIndexContentProps) {
  const hasNews = Boolean(featuredArticle || articles.length)

  return (
    <NewsMotion>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        {featuredArticle ? (
          <section aria-labelledby="featured-news-heading">
            <h2 id="featured-news-heading" className="sr-only">Berita unggulan</h2>
            <FeaturedNewsCard article={featuredArticle} />
          </section>
        ) : null}

        {articles.length ? (
          <section aria-labelledby="latest-news-heading" className={featuredArticle ? "mt-10 sm:mt-12" : ""}>
            <div className="news-section-divider flex items-center gap-3 sm:gap-4">
              <div aria-hidden="true" className="h-px flex-1 bg-slate-200" />
              <h2 id="latest-news-heading" className="shrink-0 text-xs font-bold uppercase tracking-[.12em] text-slate-500 sm:text-sm sm:tracking-[.14em]">Berita lainnya</h2>
              <div aria-hidden="true" className="h-px flex-1 bg-slate-200" />
            </div>
            <NewsGrid articles={articles} className="mt-8 sm:mt-10" />
          </section>
        ) : null}

        {!hasNews ? <section aria-label="Status berita"><EmptyNewsState /></section> : null}
      </div>
    </NewsMotion>
  )
}
