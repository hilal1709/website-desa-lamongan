"use client"

import Image from "next/image"
import Link from "next/link"
import { useLayoutEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { NewsArticle } from "@/types"
import { NewsArrowRightIcon, NewsCloseIcon, NewsEyeIcon } from "./news-icons"

function formatPreviewDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date))
}

export function NewsPreviewDialog({ article, variant = "icon" }: { article: NewsArticle; variant?: "button" | "icon" }) {
  const [open, setOpen] = useState(false)
  const content = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open || !content.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (!content.current || cancelled) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(content.current, { autoAlpha: 0, y: 24, scale: 0.96, duration: 0.42 })
          .from(".news-preview-media", { autoAlpha: 0, scale: 1.06, duration: 0.45 }, "-=0.2")
          .from(".news-preview-copy", { autoAlpha: 0, y: 14, duration: 0.35 }, "-=0.25")
      }, content)
    })

    return () => { cancelled = true; context?.revert() }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button type="button" variant="secondary" size="icon" className="absolute right-3 top-3 z-10 size-9 rounded-full bg-white/95 text-emerald-800 shadow-md backdrop-blur hover:bg-white" aria-label={`Pratinjau ${article.title}`}>
            <NewsEyeIcon size={17} />
          </Button>
        ) : <Button type="button" variant="outline" className="border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"><NewsEyeIcon size={17} /> Pratinjau</Button>}
      </DialogTrigger>
      <DialogContent ref={content} className="max-h-[min(43rem,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-white/30 bg-white p-0 shadow-2xl sm:rounded-3xl">
        <div className="relative">
          {article.image_url ? <div className="news-preview-media relative aspect-[16/9] overflow-hidden bg-emerald-950"><Image src={article.image_url} alt={`Ilustrasi ${article.title}`} fill sizes="(max-width: 640px) 95vw, 36rem" className="object-cover" /><span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 to-transparent" /></div> : <div className="news-preview-media aspect-[16/9] bg-[linear-gradient(135deg,#064e3b,#0f766e)]" />}
          <DialogClose asChild><Button type="button" variant="secondary" size="icon" className="absolute right-3 top-3 rounded-full bg-white/95 text-slate-800 shadow-md hover:bg-white" aria-label="Tutup pratinjau"><NewsCloseIcon size={18} /></Button></DialogClose>
        </div>
        <div className="news-preview-copy p-5 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{article.category || "Berita desa"} <span className="mx-1 text-emerald-300">•</span> {formatPreviewDate(article.created_at)}</p>
          <DialogTitle className="mt-3 text-[clamp(1.5rem,7vw,1.875rem)] font-black leading-tight tracking-tight text-slate-950">{article.title}</DialogTitle>
          <DialogDescription className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{article.excerpt || "Baca berita lengkap untuk informasi selengkapnya."}</DialogDescription>
          <Button asChild className="mt-6 w-full sm:w-auto"><Link href={`/berita/${article.slug}`}>Baca berita lengkap <NewsArrowRightIcon size={17} /></Link></Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
