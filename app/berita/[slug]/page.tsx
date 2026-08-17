import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { formatNewsDate } from "@/components/news/news-card"
import { NewsGrid } from "@/components/news/news-grid"
import { PageHero } from "@/components/ui/page-hero"
import { supabase } from "@/lib/supabase/client"
import type { NewsArticle } from "@/types"

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!supabase) {
    notFound()
  }

  const { data } = await supabase.from("news").select("*").eq("slug", slug).eq("published", true).single()
  const article = data as NewsArticle | null
  if (!article) notFound()

  const { data: relatedData } = await supabase.from("news").select("*").eq("published", true).neq("id", article.id).order("created_at", { ascending: false }).limit(3)
  const related = (relatedData ?? []) as NewsArticle[]

  return <article className="pb-16"><PageHero eyebrow={formatNewsDate(article.created_at)} title={article.title} description={article.excerpt || "Kabar terbaru dari Desa Kedungrejo."} image={article.image_url || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1800&q=85"} imagePosition="center 42%" /><div className="mx-auto max-w-3xl px-5 pt-10"><Link href="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-950"><ArrowLeft size={17}/> Kembali ke berita</Link><div className="mt-8 whitespace-pre-wrap text-[1.05rem] leading-8 text-slate-700">{article.content || article.excerpt || "Isi berita belum tersedia."}</div></div>{related.length ? <section className="mx-auto mt-16 max-w-7xl border-t border-slate-200 px-5 pt-12"><h2 className="text-2xl font-bold tracking-tight text-slate-950">Berita lainnya</h2><p className="mt-2 text-slate-600">Temukan kabar terbaru lainnya dari desa.</p><NewsGrid articles={related} className="mt-7" /></section> : null}</article>
}
