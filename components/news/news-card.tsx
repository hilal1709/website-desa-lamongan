import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, CalendarDays, Tag } from "lucide-react"
import type { NewsArticle } from "@/types"
import { Card, CardContent } from "@/components/ui/card"

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date))
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return <Card className="news-card group relative h-full overflow-hidden rounded-2xl border-slate-200/80 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/10">
    <Link href={`/berita/${article.slug}`} className="block">
      <div className="relative aspect-[16/9] overflow-hidden bg-emerald-950">{article.image_url ? <Image src={article.image_url} alt={`Ilustrasi ${article.title}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105"/> : <div className="size-full bg-gradient-to-br from-emerald-900 to-emerald-700"/>}<span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-emerald-950/35 to-transparent"/></div>
      <CardContent className="flex h-full flex-col p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2 text-xs"><span className="inline-flex items-center gap-1.5 font-bold text-emerald-800"><Tag size={13}/>{article.category || "Berita desa"}</span><time className="flex items-center gap-1.5 text-slate-500" dateTime={article.created_at}><CalendarDays size={14}/>{formatNewsDate(article.created_at)}</time></div><h3 className="mt-4 line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-emerald-800">{article.title}</h3>{article.excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{article.excerpt}</p> : null}<span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-emerald-800">Baca selengkapnya <ArrowUpRight size={16}/></span></CardContent>
    </Link>
  </Card>
}
