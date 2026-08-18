import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { formatNewsDate } from "@/components/news/news-card"
import { Card, CardContent } from "@/components/ui/card"
import type { NewsArticle } from "@/types"

interface PopularNewsProps {
  articles: NewsArticle[]
}

export function PopularNews({ articles }: PopularNewsProps) {
  if (!articles.length) return null

  return (
    <Card className="news-popular border-t-4 border-t-emerald-800 rounded-none shadow-sm">
      <CardContent className="p-5 sm:p-6"><aside aria-labelledby="popular-news-heading">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4"><h2 id="popular-news-heading" className="text-lg font-black tracking-tight text-slate-950">Terpopuler</h2><ArrowUpRight className="text-emerald-800" size={19} /></div>
      <ol className="divide-y divide-slate-100">{articles.slice(0, 5).map((article, index) => <li key={article.id} className="py-5 first:pt-5"><Link href={`/berita/${article.slug}`} className="group grid grid-cols-[2.25rem_1fr] gap-3"><span className="text-2xl font-black tabular-nums text-emerald-100">{String(index + 1).padStart(2, "0")}</span><span><span className="line-clamp-3 text-[15px] font-bold leading-5 text-slate-800 transition group-hover:text-emerald-800">{article.title}</span><span className="mt-2 block text-xs font-semibold text-emerald-700">{article.category || "Berita desa"} <span className="font-normal text-slate-400">· {formatNewsDate(article.created_at)}</span></span></span></Link></li>)}</ol>
      </aside></CardContent>
    </Card>
  )
}
