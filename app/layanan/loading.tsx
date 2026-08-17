"use client"

import { useLayoutEffect, useRef } from "react"

function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-2xl bg-slate-200/80 ${className}`} />
}

export default function LoadingLayanan() {
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
          .from(".layanan-loading-copy", { autoAlpha: 0, y: 24, duration: 0.55 })
          .from(".layanan-loading-dot", { autoAlpha: 0, scale: 0.5, duration: 0.32, stagger: 0.08 }, "-=0.32")
          .from(".layanan-loading-hero-line", { autoAlpha: 0, y: 16, duration: 0.45, stagger: 0.1 }, "-=0.2")
          .from(".layanan-loading-card", { autoAlpha: 0, y: 22, scale: 0.98, duration: 0.42, stagger: 0.08 }, "-=0.15")

        gsap.to(".layanan-loading-dot", { y: -7, scale: 1.08, duration: 0.48, stagger: 0.12, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to(".layanan-loading-line", { scaleX: 0.72, transformOrigin: "left", duration: 0.85, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to(".layanan-loading-shimmer", { xPercent: 250, duration: 1.4, stagger: 0.16, repeat: -1, repeatDelay: 0.25, ease: "power1.inOut" })
        gsap.to(".layanan-loading-orb", { x: 14, y: -12, duration: 3.2, stagger: 0.35, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })

    return () => { cancelled = true; context?.revert() }
  }, [])

  return (
    <main ref={root} aria-busy="true" aria-live="polite" className="min-h-screen bg-[#f3f7f3]">
      <section className="relative -mt-[88px] flex min-h-[480px] items-center overflow-hidden bg-emerald-950 px-4 pb-12 pt-[144px] sm:min-h-[600px] sm:px-6 sm:pb-20 sm:pt-[168px] lg:min-h-[640px] lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.2),transparent_35%),linear-gradient(120deg,#06251e,#0a4632)]" />
        <span aria-hidden className="layanan-loading-orb absolute left-[12%] top-[24%] size-36 rounded-full bg-emerald-300/10 blur-3xl" />
        <span aria-hidden className="layanan-loading-orb absolute bottom-[16%] right-[10%] size-44 rounded-full bg-lime-200/10 blur-3xl" />
        <div className="layanan-loading-copy relative mx-auto w-full max-w-7xl">
          <p className="sr-only" role="status">Memuat layanan desa</p>
          <div className="flex gap-2" aria-hidden="true"><span className="layanan-loading-dot size-3 rounded-full bg-emerald-300" /><span className="layanan-loading-dot size-3 rounded-full bg-emerald-300" /><span className="layanan-loading-dot size-3 rounded-full bg-emerald-300" /></div>
          <Skeleton className="layanan-loading-hero-line mt-8 h-14 max-w-3xl bg-white/15 sm:h-20" />
          <Skeleton className="layanan-loading-hero-line mt-5 h-6 max-w-2xl bg-white/10" />
          <div className="layanan-loading-hero-line mt-9 h-1 w-48 overflow-hidden rounded-full bg-white/15"><div className="layanan-loading-line h-full w-full rounded-full bg-emerald-300" /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="layanan-loading-card relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><Skeleton className="size-12 bg-emerald-100" /><Skeleton className="mt-6 h-6 w-3/4" /><Skeleton className="mt-4 h-4 w-full" /><Skeleton className="mt-2 h-4 w-4/5" /><Skeleton className="mt-8 h-5 w-32 bg-emerald-100" /><span aria-hidden className="layanan-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" /></div>)}
        </div>
      </section>
    </main>
  )
}
