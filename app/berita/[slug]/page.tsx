import Link from "next/link"
import { ArrowLeft, CalendarDays } from "lucide-react"
import { notFound } from "next/navigation"
import { NewsCard, formatNewsDate } from "@/components/news/news-card"
import { supabase } from "@/lib/supabase/client"
import type { NewsArticle } from "@/types"

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabase.from("news").select("*").eq("slug", slug).eq("published", true).single()
  const article = data as NewsArticle | null
  if (!article) notFound()

  const { data: relatedData } = await supabase.from("news").select("*").eq("published", true).neq("id", article.id).order("created_at", { ascending: false }).limit(3)
  const related = (relatedData ?? []) as NewsArticle[]

  return <article className="pb-16"><header className="bg-slate-50 px-5 pb-10 pt-12 sm:pb-14 sm:pt-16"><div className="mx-auto max-w-4xl"><Link href="/berita" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-950"><ArrowLeft size={17}/> Kembali ke berita</Link><p className="mt-8 flex items-center gap-2 text-sm font-medium text-slate-500"><CalendarDays size={16}/><time dateTime={article.created_at}>{formatNewsDate(article.created_at)}</time></p><h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">{article.title}</h1>{article.excerpt ? <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{article.excerpt}</p> : null}</div></header>{article.image_url ? <div className="mx-auto mt-8 max-w-6xl px-5"><img src={article.image_url} alt={article.title} className="aspect-[16/8] w-full rounded-2xl object-cover shadow-lg shadow-slate-900/10"/></div> : null}<div className="mx-auto max-w-3xl px-5 pt-10"><div className="whitespace-pre-wrap text-[1.05rem] leading-8 text-slate-700">{article.content || article.excerpt || "Isi berita belum tersedia."}</div></div>{related.length ? <section className="mx-auto mt-16 max-w-7xl border-t border-slate-200 px-5 pt-12"><h2 className="text-2xl font-bold tracking-tight text-slate-950">Berita lainnya</h2><p className="mt-2 text-slate-600">Temukan kabar terbaru lainnya dari desa.</p><div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <NewsCard key={item.id} article={item}/>)}</div></section> : null}</article>
}
