"use client"

import { useEffect, useRef } from "react"

const Skeleton = ({ className }: { className: string }) => <div className={`rounded-xl bg-slate-200 ${className}`} />

export default function SecurityLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const timer = window.setTimeout(() => void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.fromTo("[data-security-loading-hero]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" })
        gsap.fromTo("[data-security-loading-card]", { autoAlpha: 0, y: 16, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, stagger: 0.1, delay: 0.12, ease: "power3.out" })
        gsap.to("[data-security-loading-shimmer]", { xPercent: 240, duration: 1.25, stagger: 0.12, repeat: -1, ease: "none" })
        gsap.to("[data-security-loading-orbit]", { rotate: 360, duration: 18, repeat: -1, ease: "none" })
      }, root)
    }), 80)
    return () => { cancelled = true; window.clearTimeout(timer); context?.revert() }
  }, [])

  const shimmer = <span data-security-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/75 to-transparent" />

  return <section ref={root} aria-busy="true" aria-live="polite" className="py-1 sm:py-2">
    <p className="sr-only" role="status">Memuat pengaturan keamanan akun</p>
    <header data-security-loading-hero className="rounded-[28px] bg-slate-950 px-5 py-6 sm:px-7 sm:py-7"><Skeleton className="h-3 w-24 bg-emerald-300/25" /><Skeleton className="mt-4 h-9 max-w-xs bg-white/15" /><Skeleton className="mt-4 h-4 max-w-xl bg-white/10" /></header>
    <div className="relative mt-6 overflow-hidden rounded-[2rem] bg-slate-950 p-1 shadow-xl shadow-emerald-950/10 sm:mt-8"><div data-security-loading-orbit className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full border border-emerald-400/20" /><div className="relative rounded-[1.8rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/80 p-5 sm:p-8"><div data-security-loading-card className="flex items-center justify-between border-b border-white/10 pb-6"><div className="flex items-center gap-4"><Skeleton className="size-14 bg-emerald-300/80" /><div><Skeleton className="h-3 w-32 bg-emerald-300/25" /><Skeleton className="mt-3 h-6 w-52 bg-white/15" /></div></div><Skeleton className="h-8 w-24 rounded-full bg-amber-300/20" /></div><div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]"><article data-security-loading-card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white p-5 shadow-xl"><Skeleton className="h-5 w-40" /><Skeleton className="mt-3 h-4 max-w-lg" /><Skeleton className="mt-2 h-4 w-3/4" /><div className="mt-6 rounded-2xl bg-slate-100 p-4"><Skeleton className="h-4 w-40 bg-slate-200" /><Skeleton className="mt-3 h-4 w-full bg-slate-200" /><Skeleton className="mt-2 h-4 w-5/6 bg-slate-200" /></div><Skeleton className="mt-5 h-12 w-64 bg-emerald-100" />{shimmer}</article><aside data-security-loading-card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5"><Skeleton className="h-3 w-36 bg-emerald-300/25" /><Skeleton className="mt-6 h-4 w-full bg-white/10" /><Skeleton className="mt-3 h-1.5 w-full rounded-full bg-white/10" /><div className="mt-6 space-y-4 border-y border-white/10 py-5"><Skeleton className="h-10 w-full bg-white/10" /><Skeleton className="h-10 w-full bg-white/10" /></div>{shimmer}</aside></div></div></div>
  </section>
}
