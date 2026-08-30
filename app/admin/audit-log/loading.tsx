"use client"

import { useEffect, useRef } from "react"

const Skeleton = ({ className = "" }: { className?: string }) => <span className={`block rounded-xl bg-slate-200 ${className}`} />

export default function AuditLogLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-audit-loading-header]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.36 })
          .fromTo("[data-audit-loading-hero]", { autoAlpha: 0, y: 18, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.44 }, "-=.16")
          .fromTo("[data-audit-loading-stat]", { autoAlpha: 0, y: 14, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, stagger: 0.07, ease: "back.out(1.45)" }, "-=.18")
          .fromTo("[data-audit-loading-table]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.42 }, "-=.16")
        gsap.to("[data-audit-loading-shimmer]", { xPercent: 250, duration: 1.45, stagger: 0.1, repeat: -1, ease: "none" })
        gsap.to("[data-audit-loading-orb]", { x: 18, y: 12, scale: 1.1, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })
    return () => { cancelled = true; context?.revert() }
  }, [])

  return <main ref={root} aria-busy="true" aria-live="polite" className="py-1 sm:py-2"><p className="sr-only" role="status">Memuat audit log</p>
    <header data-audit-loading-header><Skeleton className="h-3 w-28 bg-emerald-100" /><Skeleton className="mt-3 h-10 w-56 max-w-full" /><Skeleton className="mt-3 h-4 w-full max-w-2xl" /></header>
    <section data-audit-loading-hero className="relative mt-5 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-5 shadow-sm sm:p-6"><span data-audit-loading-orb className="absolute -right-12 -top-14 size-44 rounded-full bg-emerald-300/30 blur-2xl" /><div className="relative flex items-start justify-between gap-4"><div><Skeleton className="h-3 w-36 bg-emerald-100" /><Skeleton className="mt-3 h-8 w-64 max-w-full" /><Skeleton className="mt-3 h-4 w-96 max-w-full bg-slate-100" /></div><Skeleton className="size-12 rounded-2xl bg-emerald-100" /></div></section>
    <section aria-label="Memuat ringkasan audit" className="mt-5 grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div data-audit-loading-stat key={index} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-4"><Skeleton className="size-11 bg-emerald-50" /><div className="flex-1"><Skeleton className="h-3 w-24 bg-slate-100" /><Skeleton className="mt-2 h-7 w-14" /><Skeleton className="mt-2 h-3 w-28 bg-slate-100" /></div></div><span data-audit-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" /></div>)}</section>
    <section data-audit-loading-table className="relative mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/[.04]"><div className="border-b border-slate-100 p-4 sm:p-5"><div className="flex items-center justify-between"><div><Skeleton className="h-6 w-44" /><Skeleton className="mt-2 h-4 w-64 max-w-full bg-slate-100" /></div><Skeleton className="size-5 rounded-full bg-emerald-100" /></div><div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]"><Skeleton className="h-11 w-full bg-slate-100" /><Skeleton className="h-11 w-full bg-slate-100" /></div></div><div className="hidden bg-slate-50/80 px-5 py-3.5 sm:grid sm:grid-cols-[1.1fr_1fr_1fr_1fr_6rem] sm:gap-4">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-3 w-16 bg-slate-200" />)}</div><div className="divide-y divide-slate-100">{Array.from({ length: 6 }, (_, index) => <div key={index} className="relative grid min-h-16 grid-cols-[1.1fr_1fr_1fr_6rem] items-center gap-4 overflow-hidden px-5 py-4 sm:grid-cols-[1.1fr_1fr_1fr_1fr_6rem]"><Skeleton className="h-4 w-28 bg-slate-100" /><Skeleton className="h-7 w-24 rounded-full bg-emerald-50" /><Skeleton className="h-4 w-24 bg-slate-100" /><Skeleton className="hidden h-3 w-20 bg-slate-100 sm:block" /><Skeleton className="h-8 w-14 bg-slate-100" /><span data-audit-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" /></div>)}</div></section>
  </main>
}
