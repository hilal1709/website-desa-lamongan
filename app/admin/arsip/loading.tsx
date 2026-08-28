"use client"

import { useEffect, useRef } from "react"

const Skeleton = ({ className }: { className: string }) => <div className={`rounded-xl bg-slate-200 ${className}`} />

export default function ArchiveLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const timer = window.setTimeout(() => void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-archive-loading-hero]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .45 })
          .fromTo("[data-archive-loading-stat]", { autoAlpha: 0, y: 14, scale: .96 }, { autoAlpha: 1, y: 0, duration: .32, stagger: .07 }, "-=.22")
          .fromTo("[data-archive-loading-panel]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .38, stagger: .1 }, "-=.16")
        gsap.to("[data-archive-loading-shimmer]", { xPercent: 240, duration: 1.25, stagger: .1, repeat: -1, ease: "none" })
        gsap.to("[data-archive-loading-dot]", { y: -5, scale: 1.08, duration: .48, stagger: .12, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to("[data-archive-loading-orb]", { x: 18, y: -12, scale: 1.13, duration: 3.9, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    }), 80)
    return () => { cancelled = true; window.clearTimeout(timer); context?.revert() }
  }, [])

  const panel = (content: React.ReactNode, className = "") => <section data-archive-loading-panel className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 ${className}`}>{content}<span data-archive-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent" /></section>

  return <main ref={root} aria-busy="true" aria-live="polite" className="py-1 sm:py-2">
    <p className="sr-only" role="status">Memuat arsip dokumen</p>
    <header data-archive-loading-hero className="relative overflow-hidden rounded-[28px] bg-slate-950 px-5 py-6 shadow-xl shadow-slate-950/15 sm:px-7 sm:py-7"><span data-archive-loading-orb aria-hidden className="absolute -right-10 -top-12 size-48 rounded-full bg-emerald-400/20 blur-3xl" /><div className="relative"><div className="flex gap-2"><span data-archive-loading-dot className="size-2.5 rounded-full bg-emerald-300" /><span data-archive-loading-dot className="size-2.5 rounded-full bg-emerald-300" /><span data-archive-loading-dot className="size-2.5 rounded-full bg-emerald-300" /></div><Skeleton className="mt-7 h-9 max-w-sm bg-white/15" /><Skeleton className="mt-4 h-5 max-w-2xl bg-white/10" /><div className="mt-6 grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div data-archive-loading-stat key={index} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.07] p-4"><Skeleton className="size-9 bg-emerald-300/20" /><div className="flex-1"><Skeleton className="h-5 w-12 bg-white/15" /><Skeleton className="mt-2 h-3 w-20 bg-white/10" /></div></div>)}</div></div></header>
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      {panel(<><div className="flex items-center justify-between border-b border-slate-100 pb-5"><div><Skeleton className="h-6 w-36" /><Skeleton className="mt-3 h-4 w-52" /></div><Skeleton className="h-9 w-24" /></div><div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_170px]"><Skeleton className="h-12" /><Skeleton className="h-12" /></div><div className="mt-4 divide-y divide-slate-100">{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-4 py-4"><Skeleton className="size-11 bg-emerald-100" /><div className="flex-1"><Skeleton className="h-5 w-2/5" /><Skeleton className="mt-3 h-3 w-1/3" /><Skeleton className="mt-3 h-4 w-3/4" /></div><Skeleton className="h-10 w-28" /></div>)}</div></>)}
      {panel(<><Skeleton className="h-6 w-40" /><Skeleton className="mt-3 h-4 w-full" /><Skeleton className="mt-7 h-4 w-28" /><Skeleton className="mt-2 h-12" /><Skeleton className="mt-5 h-4 w-24" /><Skeleton className="mt-2 h-12" /><Skeleton className="mt-5 h-24" /><Skeleton className="mt-5 h-11" /></>, "h-fit")}
    </div>
  </main>
}
