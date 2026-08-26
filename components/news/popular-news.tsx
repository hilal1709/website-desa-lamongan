import Link from "next/link"
import { formatNewsDate } from "@/components/news/news-card"
import { Card, CardContent } from "@/components/ui/card"
import type { NewsArticle } from "@/types"
import { NewsArrowUpRightIcon } from "./news-icons"

interface PopularNewsProps {
  articles: NewsArticle[]
}

export function PopularNews({ articles }: PopularNewsProps) {
  if (!articles.length) return null

  return (
    <Card className="news-popular overflow-hidden rounded-3xl border-t-4 border-t-emerald-800 shadow-sm">
      <CardContent className="p-5 sm:p-6"><aside aria-labelledby="popular-news-heading">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Paling dibaca</p><h2 id="popular-news-heading" className="mt-1 text-lg font-black tracking-tight text-slate-950">Terpopuler</h2></div><span className="rounded-full bg-emerald-50 p-2 text-emerald-800"><NewsArrowUpRightIcon size={18} /></span></div>
      <ol className="divide-y divide-slate-100">{articles.slice(0, 5).map((article, index) => <li key={article.id} className="news-popular-item py-5 first:pt-5"><Link href={`/berita/${article.slug}`} className="group grid grid-cols-[2.25rem_1fr] gap-3"><span className="text-2xl font-black tabular-nums text-emerald-100">{String(index + 1).padStart(2, "0")}</span><span><span className="line-clamp-3 text-[15px] font-bold leading-5 text-slate-800 transition group-hover:text-emerald-800">{article.title}</span><span className="mt-2 block text-xs font-semibold text-emerald-700">{article.category || "Berita desa"} <span className="font-normal text-slate-400">· {formatNewsDate(article.created_at)}</span></span></span></Link></li>)}</ol>
      </aside></CardContent>
    </Card>
  )
}
