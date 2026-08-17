"use client"

import { useLayoutEffect, useRef } from "react"

function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-2xl bg-slate-200/80 ${className}`} />
}

export default function LoadingAduan() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined

    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return

      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline
          .from(".aduan-loading-copy", { autoAlpha: 0, y: 22, duration: 0.5 })
          .from(".aduan-loading-form", { autoAlpha: 0, x: -28, scale: 0.985, duration: 0.65 }, "-=0.18")
          .from(".aduan-loading-history", { autoAlpha: 0, x: 28, duration: 0.6 }, "-=0.5")
          .from(".aduan-loading-field", { autoAlpha: 0, y: 14, duration: 0.35, stagger: 0.07 }, "-=0.3")
          .from(".aduan-loading-row", { autoAlpha: 0, x: 16, duration: 0.35, stagger: 0.08 }, "-=0.3")

        gsap.to(".aduan-loading-dot", { y: -6, scale: 1.08, duration: 0.48, stagger: 0.12, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to(".aduan-loading-shimmer", { xPercent: 250, duration: 1.35, stagger: 0.12, repeat: -1, repeatDelay: 0.2, ease: "power1.inOut" })
      }, root)
    })

    return () => { cancelled = true; context?.revert() }
  }, [])

  return (
    <main ref={root} aria-busy="true" aria-live="polite" className="min-h-screen bg-slate-50/70">
      <section className="relative -mt-[88px] flex min-h-[480px] items-center overflow-hidden bg-emerald-950 px-4 pb-12 pt-[144px] sm:min-h-[600px] sm:px-6 sm:pb-20 sm:pt-[168px] lg:min-h-[640px] lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(52,211,153,0.2),transparent_34%),linear-gradient(120deg,#06251e,#0a4632)]" />
        <div className="aduan-loading-copy relative mx-auto w-full max-w-7xl">
          <p className="sr-only" role="status">Memuat halaman aduan</p>
          <div className="flex gap-2" aria-hidden="true"><span className="aduan-loading-dot size-3 rounded-full bg-emerald-300" /><span className="aduan-loading-dot size-3 rounded-full bg-emerald-300" /><span className="aduan-loading-dot size-3 rounded-full bg-emerald-300" /></div>
          <Skeleton className="mt-8 h-14 max-w-3xl bg-white/15 sm:h-20" />
          <Skeleton className="mt-5 h-6 max-w-2xl bg-white/10" />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
        <div className="aduan-loading-form relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-950/[0.06] sm:p-7">
          <Skeleton className="aduan-loading-field h-8 w-48" />
          <Skeleton className="aduan-loading-field mt-3 h-5 max-w-sm" />
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="aduan-loading-field space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-11 w-full" /></div>)}
          </div>
          <div className="aduan-loading-field mt-5 space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-32 w-full" /></div>
          <Skeleton className="aduan-loading-field mt-6 h-12 w-36 bg-emerald-100" />
          <span aria-hidden className="aduan-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        </div>

        <div className="aduan-loading-history">
          <Skeleton className="h-4 w-32 bg-emerald-100" />
          <Skeleton className="mt-3 h-8 w-52" />
          <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-950/[0.04]">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className={`aduan-loading-row relative flex gap-3 p-5 ${index > 0 ? "border-t border-slate-100" : ""}`}><Skeleton className="size-10 shrink-0 bg-emerald-100" /><div className="min-w-0 flex-1 space-y-2"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full" /></div><span aria-hidden className="aduan-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" /></div>)}
          </div>
        </div>
      </section>
    </main>
  )
}
