import Link from "next/link"
import Image from "next/image"
import type { NewsArticle } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { NewsArrowUpRightIcon, NewsCalendarIcon, NewsTagIcon } from "@/components/news/news-icons"

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date))
}

export function NewsCard({ article }: { article: NewsArticle }) {
  const articleHref = `/berita/${article.slug}`

  return (
    <Card className="news-card group relative h-full overflow-hidden rounded-2xl border-slate-200/80 transition duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/10">
      <Link href={articleHref} className="block" aria-label={`Baca berita: ${article.title}`}>
        <div className="relative aspect-[16/9] overflow-hidden bg-emerald-950">
          {article.image_url ? <Image src={article.image_url} alt={`Ilustrasi ${article.title}`} fill loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="size-full bg-gradient-to-br from-emerald-900 to-emerald-700" />}
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-emerald-950/55 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-emerald-800 backdrop-blur">{article.category || "Berita desa"}</span>
        </div>
        <CardContent className="flex h-full flex-col p-5 sm:p-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-500"><NewsCalendarIcon size={14} /><time dateTime={article.created_at}>{formatNewsDate(article.created_at)}</time><span aria-hidden="true" className="mx-1 size-1 rounded-full bg-slate-300" /><span className="inline-flex items-center gap-1 text-emerald-700"><NewsTagIcon size={12} />Info desa</span></div>
          <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition group-hover:text-emerald-800">{article.title}</h3>
          {article.excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{article.excerpt}</p> : null}
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-emerald-800">Baca selengkapnya <NewsArrowUpRightIcon className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={16} /></span>
        </CardContent>
      </Link>
    </Card>
  )
}
