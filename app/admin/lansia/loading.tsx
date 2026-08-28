"use client"

import { useEffect, useRef } from "react"
import { HeartPulse } from "@/components/lansia/lansia-icons"

const Skeleton = ({ className }: { className: string }) => <span className={`block rounded-xl bg-slate-200 ${className}`} />

export default function ElderlyLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-elderly-loading-hero]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .42 })
          .fromTo("[data-elderly-loading-panel]", { autoAlpha: 0, y: 14, scale: .985 }, { autoAlpha: 1, y: 0, scale: 1, duration: .34, stagger: .07 }, "-=.15")
        gsap.to("[data-elderly-loading-shimmer]", { xPercent: 235, duration: 1.2, stagger: .1, repeat: -1, ease: "none" })
        gsap.to("[data-elderly-loading-pulse]", { scale: 1.14, autoAlpha: .45, duration: .85, stagger: .12, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })
    return () => { cancelled = true; context?.revert() }
  }, [])

  const panel = (children: React.ReactNode, className = "") => <section data-elderly-loading-panel className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}<span data-elderly-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/70" /></section>

  return <section ref={root} aria-busy="true" aria-live="polite" className="elderly-health-manager mx-auto max-w-7xl space-y-5 py-1">
    <p className="sr-only" role="status">Memuat rekam medis lansia</p>
    <header data-elderly-loading-hero className="relative isolate overflow-hidden rounded-[28px] bg-emerald-800 p-5 text-white shadow-xl sm:p-8">
      <div className="absolute -right-16 -top-20 size-64 rounded-full bg-emerald-300/20 blur-3xl" /><div className="relative"><span className="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25"><HeartPulse className="size-6" /></span><div className="mt-5 flex gap-2">{Array.from({ length: 3 }, (_, index) => <span key={index} data-elderly-loading-pulse className="size-2.5 rounded-full bg-emerald-200" />)}</div><Skeleton className="mt-4 h-8 max-w-sm bg-white/20" /><Skeleton className="mt-3 h-4 max-w-xl bg-white/15" /></div>
    </header>
    <nav data-elderly-loading-panel aria-hidden className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><Skeleton className="h-10 w-32 bg-emerald-100" /><Skeleton className="h-10 w-28" /></nav>
    {panel(<><Skeleton className="h-6 w-44" /><Skeleton className="mt-3 h-4 max-w-md" /><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 6 }, (_, index) => <div key={index}><Skeleton className="h-3 w-20" /><Skeleton className="mt-2 h-11 w-full bg-slate-100" /></div>)}</div><Skeleton className="mt-5 h-11 w-48 bg-emerald-100" /></>, "border-emerald-100 bg-emerald-50/50")}
    {panel(<div className="grid gap-3 sm:grid-cols-[1fr_220px_auto]"><Skeleton className="h-11 w-full bg-slate-100" /><Skeleton className="h-11 w-full" /><Skeleton className="h-11 w-24 bg-emerald-100" /></div>)}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index}>{panel(<><Skeleton className="h-5 w-28" /><Skeleton className="mt-3 h-4 w-3/4" /><Skeleton className="mt-6 h-4 w-full" /><Skeleton className="mt-3 h-4 w-4/5" /><div className="mt-6 flex gap-2"><Skeleton className="h-7 w-20 bg-rose-50" /><Skeleton className="h-7 w-24 bg-rose-50" /></div></>)}</div>)}</div>
  </section>
}
