import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { formatNewsDate } from "@/components/news/news-card"
import { NewsGrid } from "@/components/news/news-grid"
import { PageHero } from "@/components/ui/page-hero"
import { ArticleBody } from "@/components/news/article-body"
import { getCmsNews } from "@/lib/news-cms"
import type { NewsArticle } from "@/types"

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const data = await getCmsNews()
  const article = data.articles.find((item) => item.slug === slug && item.published)
    ? (() => { const item = data.articles.find((value) => value.slug === slug && value.published)!; return { id: item.id, title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content, image_url: item.image || null, category: item.category, published: item.published, created_at: item.createdAt } satisfies NewsArticle })()
    : null
  if (!article) notFound()
  const related = data.articles.filter((item) => item.published && item.id !== article.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3).map((item) => ({ id: item.id, title: item.title, slug: item.slug, excerpt: item.excerpt, content: item.content, image_url: item.image || null, category: item.category, published: item.published, created_at: item.createdAt } satisfies NewsArticle))

  return <article className="pb-16"><PageHero eyebrow={formatNewsDate(article.created_at)} title={article.title} description={article.excerpt || "Kabar terbaru dari Desa Kedungrejo."} image={article.image_url || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1800&q=85"} imagePosition="center 42%" /><div className="mx-auto max-w-3xl px-5 pt-10"><Link href="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-950"><ArrowLeft size={17}/> Kembali ke berita</Link><div className="mt-8"><ArticleBody content={article.content || article.excerpt || "Isi berita belum tersedia."} /></div></div>{related.length ? <section className="mx-auto mt-16 max-w-7xl border-t border-slate-200 px-5 pt-12"><h2 className="text-2xl font-bold tracking-tight text-slate-950">Berita lainnya</h2><p className="mt-2 text-slate-600">Temukan kabar terbaru lainnya dari desa.</p><NewsGrid articles={related} className="mt-7" /></section> : null}</article>
}
