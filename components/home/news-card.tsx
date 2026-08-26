import Image from "next/image"
import Link from "next/link"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import type { NewsItem } from "@/types"

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const sizes = featured
    ? "(max-width: 767px) 100vw, (max-width: 1280px) 66vw, 850px"
    : "(max-width: 767px) 100vw, (max-width: 1280px) 33vw, 420px"

  return (
    <Link href="/berita" className="group">
      <Card className="h-full overflow-hidden rounded-3xl border-slate-100 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        {item.image && (
          <div className={`relative overflow-hidden ${featured ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
            <Image src={item.image} alt="" fill loading="lazy" quality={70} sizes={sizes} className="object-cover transition duration-500 group-hover:scale-105" />
          </div>
        )}
        <CardContent className="p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">{item.category} <span className="ml-2 font-medium text-slate-400">{item.date}</span></div>
          <CardTitle className={`mt-3 leading-snug group-hover:text-green-700 ${featured ? "text-xl md:text-2xl" : ""}`}>{item.title}</CardTitle>
          {featured && item.excerpt && <p className="mt-3 text-sm leading-6 text-slate-500">{item.excerpt}</p>}
        </CardContent>
      </Card>
    </Link>
  )
}
