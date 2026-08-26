"use client"

import Link from "next/link"
import { useLayoutEffect, useRef } from "react"
import { NewsRadioIcon } from "./news-icons"

interface NewsPageHeaderProps {
  articleCount: number
  hasActiveFilters: boolean
  categories: string[]
  activeCategory: string
}

export function NewsPageHeader({ articleCount, hasActiveFilters, categories, activeCategory }: NewsPageHeaderProps) {
  const root = useRef<HTMLElement>(null)
  const description = hasActiveFilters
    ? `${articleCount} berita ditemukan berdasarkan pencarian Anda.`
    : "Cerita, kabar, dan agenda yang tumbuh bersama warga Desa Kedungrejo."

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".news-masthead-kicker", { autoAlpha: 0, x: -16, duration: 0.45 })
          .from(".news-masthead-title", { autoAlpha: 0, y: 28, duration: 0.7 }, "-=0.18")
          .from(".news-masthead-copy", { autoAlpha: 0, y: 16, duration: 0.5 }, "-=0.38")
          .from(".news-channel-nav", { autoAlpha: 0, y: 12, duration: 0.45 }, "-=0.28")
      }, root)
    })
    return () => { cancelled = true; context?.revert() }
  }, [])

  return (
    <header ref={root} className="border-b border-slate-200 bg-white pt-7 sm:pt-9">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b-4 border-slate-950 pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
          <div className="min-w-0"><p className="news-masthead-kicker flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700"><NewsRadioIcon size={14} className="shrink-0 animate-pulse" /> Liputan Desa</p><h1 className="news-masthead-title mt-2 text-[clamp(2rem,10vw,3rem)] font-black tracking-[-0.06em] text-slate-950">KEDUNGREJO <span className="text-emerald-700">NEWS</span></h1></div>
          <p className="news-masthead-copy max-w-md text-sm leading-6 text-slate-600 sm:text-right">{description} <strong className="font-bold text-slate-950">{articleCount} publikasi</strong></p>
        </div>
        <nav aria-label="Kategori berita" className="news-channel-nav -mx-1 flex gap-1 overflow-x-auto px-1 py-3 text-sm font-bold whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><Link href="/berita" className={`rounded-md px-3 py-2 transition ${!activeCategory ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>TERKINI</Link>{categories.map((item) => <Link key={item} href={`/berita?kategori=${encodeURIComponent(item)}`} className={`rounded-md px-3 py-2 transition ${activeCategory === item ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>{item.toUpperCase()}</Link>)}</nav>
      </div>
    </header>
  )
}
