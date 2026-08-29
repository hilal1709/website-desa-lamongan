"use client"

import { useEffect, useRef } from "react"

const Skeleton = ({ className }: { className: string }) => <div className={`rounded-xl bg-slate-200 ${className}`} />

export default function AdminServicesLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const timer = window.setTimeout(() => void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-service-loading-hero]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .42 })
          .fromTo("[data-service-loading-stat]", { autoAlpha: 0, y: 14, scale: .96 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .07 }, "-=.2")
          .fromTo("[data-service-loading-panel]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .34, stagger: .08 }, "-=.14")
        gsap.to("[data-service-loading-shimmer]", { xPercent: 250, duration: 1.25, stagger: .1, repeat: -1, ease: "none" })
        gsap.to("[data-service-loading-dot]", { y: -5, duration: .42, stagger: .1, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    }), 80)
    return () => { cancelled = true; window.clearTimeout(timer); context?.revert() }
  }, [])

  return <section ref={root} aria-busy="true" aria-live="polite" className="space-y-5 py-1 sm:py-2">
    <p className="sr-only" role="status">Memuat layanan dan pengajuan warga</p>
    <header data-service-loading-hero className="relative overflow-hidden rounded-[28px] bg-slate-950 px-5 py-6 sm:px-7 sm:py-7"><div className="flex gap-2"><span data-service-loading-dot className="size-2.5 rounded-full bg-emerald-300" /><span data-service-loading-dot className="size-2.5 rounded-full bg-emerald-300" /><span data-service-loading-dot className="size-2.5 rounded-full bg-emerald-300" /></div><Skeleton className="mt-7 h-9 max-w-xl bg-white/15" /><Skeleton className="mt-4 h-5 max-w-2xl bg-white/10" /><div className="mt-6 grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div data-service-loading-stat key={index} className="rounded-2xl border border-white/10 bg-white/[.07] p-4"><Skeleton className="size-9 bg-emerald-300/20" /><Skeleton className="mt-3 h-5 w-12 bg-white/15" /><Skeleton className="mt-2 h-3 w-28 bg-white/10" /></div>)}</div></header>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]"><LoadingCard titleWidth="w-44">{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-3 border-t border-slate-100 p-4"><Skeleton className="size-11 bg-emerald-100" /><div className="flex-1"><Skeleton className="h-4 w-2/5" /><Skeleton className="mt-2 h-3 w-3/5" /></div><Skeleton className="size-10" /></div>)}</LoadingCard><LoadingCard titleWidth="w-40"><Skeleton className="size-11 bg-emerald-100" /><Skeleton className="mt-5 h-5 w-3/4" /><Skeleton className="mt-3 h-4 w-full" /><Skeleton className="mt-2 h-4 w-4/5" /></LoadingCard></div>
    <LoadingCard titleWidth="w-48"><Skeleton className="mt-1 h-4 w-96 max-w-full" />{Array.from({ length: 3 }, (_, index) => <div key={index} className="border-t border-slate-100 p-4 sm:p-5"><Skeleton className="h-5 w-44" /><Skeleton className="mt-2 h-4 w-60" /><div className="mt-4 grid gap-2 sm:grid-cols-[170px_minmax(0,1fr)_88px_80px]"><Skeleton className="h-11" /><Skeleton className="h-11" /><Skeleton className="h-11" /><Skeleton className="h-11" /></div></div>)}</LoadingCard>
  </section>
}

function LoadingCard({ titleWidth, children }: { titleWidth: string; children: React.ReactNode }) { return <article data-service-loading-panel className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="p-5"><Skeleton className={`h-6 ${titleWidth}`} /><Skeleton className="mt-3 h-4 w-3/5" /></div>{children}<span data-service-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent" /></article> }
