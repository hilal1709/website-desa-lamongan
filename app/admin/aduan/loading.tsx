"use client"

import { useEffect, useRef } from "react"

const Skeleton = ({ className = "" }: { className?: string }) => <div className={`rounded-xl bg-slate-200 ${className}`} />

export default function AdminComplaintLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-complaint-loading-header]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 })
          .fromTo("[data-complaint-loading-stat]", { autoAlpha: 0, y: 14, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, stagger: 0.07, ease: "back.out(1.4)" }, "-=0.18")
          .fromTo("[data-complaint-loading-panel]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.42 }, "-=0.18")
        gsap.to("[data-complaint-loading-shimmer]", { xPercent: 240, duration: 1.3, stagger: 0.12, repeat: -1, ease: "none" })
        gsap.to("[data-complaint-loading-dot]", { y: -4, scale: 1.08, duration: 0.45, stagger: 0.1, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })
    return () => { cancelled = true; context?.revert() }
  }, [])

  return <main ref={root} aria-busy="true" aria-live="polite" className="py-1 sm:py-2">
    <p className="sr-only" role="status">Memuat pengelolaan aduan</p>
    <header data-complaint-loading-header><Skeleton className="h-3 w-28 bg-emerald-100" /><Skeleton className="mt-3 h-10 w-56 max-w-full" /><Skeleton className="mt-3 h-4 w-full max-w-2xl" /><Skeleton className="mt-2 h-4 w-4/5 max-w-xl" /></header>
    <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} data-complaint-loading-stat className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="absolute inset-x-0 top-0 h-1 bg-emerald-100" /><div className="flex items-end justify-between"><div><Skeleton className="h-4 w-20" /><Skeleton className="mt-3 h-9 w-12" /></div><Skeleton className="size-10 bg-slate-100" /></div><span data-complaint-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent" /></div>)}</section>
    <section data-complaint-loading-panel className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 bg-slate-50/70 p-5"><div className="flex items-center gap-2"><span className="flex gap-1"><span data-complaint-loading-dot className="size-1.5 rounded-full bg-emerald-400" /><span data-complaint-loading-dot className="size-1.5 rounded-full bg-emerald-400" /><span data-complaint-loading-dot className="size-1.5 rounded-full bg-emerald-400" /></span><Skeleton className="h-5 w-40" /></div><Skeleton className="mt-3 h-4 w-80 max-w-full" /></div><div className="p-4 sm:p-5"><div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px_110px]"><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12 bg-emerald-100" /></div><div className="mt-5 overflow-hidden rounded-xl border border-slate-100"><div className="grid grid-cols-[1.4fr_1fr_.7fr_1fr_90px] gap-4 bg-slate-50/70 p-4">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-3" />)}</div>{Array.from({ length: 5 }, (_, row) => <div key={row} className="grid grid-cols-[1.4fr_1fr_.7fr_1fr_90px] items-center gap-4 border-t border-slate-100 p-4"><div><Skeleton className="h-4 w-4/5" /><Skeleton className="mt-2 h-3 w-3/5" /></div><div><Skeleton className="h-4 w-2/3" /><Skeleton className="mt-2 h-3 w-4/5" /></div><Skeleton className="h-6 w-16 rounded-full bg-emerald-50" /><Skeleton className="h-4 w-4/5" /><Skeleton className="h-9 w-full" /></div>)}</div></div><span data-complaint-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent" /></section>
  </main>
}
