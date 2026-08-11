import Link from "next/link"
import { ArrowUpRight, CalendarDays } from "lucide-react"
import type { NewsArticle } from "@/types"

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date))
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return <article className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10">
    <Link href={`/berita/${article.slug}`} className="block">
      <div className="relative aspect-[16/9] overflow-hidden bg-emerald-950">{article.image_url ? <img src={article.image_url} alt="" className="size-full object-cover transition duration-500 group-hover:scale-105"/> : <div className="size-full bg-gradient-to-br from-emerald-900 to-emerald-700"/>}<span className="absolute inset-0 bg-gradient-to-t from-emerald-950/35 to-transparent"/></div>
      <div className="p-5"><div className="flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14}/><time dateTime={article.created_at}>{formatNewsDate(article.created_at)}</time></div><h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-emerald-800">{article.title}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{article.excerpt || "Baca informasi terbaru dari Pemerintah Desa Kedungrejo."}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-emerald-800">Baca selengkapnya <ArrowUpRight size={16}/></span></div>
    </Link>
  </article>
}
