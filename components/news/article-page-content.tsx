import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ArticleBody } from "@/components/news/article-body"
import { NewsGrid } from "@/components/news/news-grid"
import type { NewsArticle } from "@/types"

interface ArticlePageContentProps { article: NewsArticle; related: NewsArticle[] }

export function ArticlePageContent({ article, related }: ArticlePageContentProps) {
  const content = article.content || article.excerpt || "Isi berita belum tersedia."
  return <main>
    <article itemScope itemType="https://schema.org/NewsArticle" className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
      <meta itemProp="headline" content={article.title} />
      <meta itemProp="datePublished" content={article.created_at} />
      <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-950"><ArrowLeft size={17} aria-hidden="true" />Kembali ke berita</Link>
      <div itemProp="articleBody" className="mt-8"><ArticleBody content={content} /></div>
    </article>
    {related.length ? <section aria-labelledby="related-news-heading" className="mx-auto max-w-7xl border-t border-slate-200 px-5 py-12 sm:px-6 sm:py-16 lg:px-8"><h2 id="related-news-heading" className="text-2xl font-bold tracking-tight text-slate-950">Berita lainnya</h2><p className="mt-2 text-slate-600">Temukan kabar terbaru lainnya dari desa.</p><NewsGrid articles={related} className="mt-7" /></section> : null}
  </main>
}
