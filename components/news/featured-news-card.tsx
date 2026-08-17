import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CalendarDays } from "lucide-react"
import type { NewsArticle } from "@/types"
import { Button } from "@/components/ui/button"
import { formatNewsDate } from "./news-card"

export function FeaturedNewsCard({ article }: { article: NewsArticle }) {
  return <article className="news-featured group relative min-h-[380px] overflow-hidden rounded-2xl bg-emerald-950 shadow-lg sm:min-h-[500px]">{article.image_url ? <Image src={article.image_url} alt={`Ilustrasi ${article.title}`} fill priority sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover transition duration-700 group-hover:scale-105"/> : <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700"/>}<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent"/><div className="relative flex min-h-[380px] max-w-4xl flex-col justify-end p-5 text-white sm:min-h-[500px] sm:p-9"><div className="flex items-center gap-3 text-xs text-white/85 sm:text-sm"><time className="flex items-center gap-1.5" dateTime={article.created_at}><CalendarDays size={14}/>{formatNewsDate(article.created_at)}</time></div><h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:mt-4 sm:text-4xl">{article.title}</h2>{article.excerpt ? <p className="mt-3 line-clamp-3 max-w-3xl text-sm leading-6 text-slate-200 sm:mt-4 sm:text-base sm:leading-7">{article.excerpt}</p> : null}<Button asChild variant="secondary" className="mt-5 w-full bg-white text-emerald-950 hover:bg-emerald-100 sm:mt-6 sm:w-fit"><Link href={`/berita/${article.slug}`}>Baca berita <ArrowRight size={17}/></Link></Button></div></article>
}
