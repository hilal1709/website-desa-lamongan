"use client"

import { useLayoutEffect, useRef } from "react"
import { BarChart3 } from "lucide-react"

export function InfographicLoading() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(".infographic-loading-icon", { scale: .65, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .45 })
          .fromTo(".infographic-loading-copy", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .4 }, "<.1")
          .fromTo(".infographic-loading-card", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .45, stagger: .09 }, "<.08")
        gsap.to(".infographic-loading-bar", { scaleY: 1.7, duration: .65, stagger: { each: .11, yoyo: true, repeat: -1 }, ease: "sine.inOut", transformOrigin: "bottom" })
        gsap.to(".infographic-loading-shimmer", { xPercent: 180, duration: 1.3, repeat: -1, ease: "none" })
      }, root)
    })

    return () => { cancelled = true; context?.revert() }
  }, [])

  return <div ref={root} className="min-h-[72vh] bg-slate-50 px-5 py-16"><div className="mx-auto flex max-w-7xl flex-col items-center"><div className="infographic-loading-icon grid h-16 w-16 place-items-center rounded-3xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15"><BarChart3 className="h-7 w-7" /></div><div className="infographic-loading-copy mt-5 text-center"><p className="text-lg font-black text-slate-900">Menyiapkan infografis desa</p><p className="mt-1 text-sm text-slate-500">Memuat data dan visualisasi terbaru</p></div><div className="mt-7 flex h-9 items-end gap-1.5" aria-label="Memuat grafik" role="status">{[16, 26, 20, 34, 23].map((height, index) => <span key={index} className="infographic-loading-bar w-2 rounded-t-full bg-emerald-600" style={{ height }} />)}</div><div className="mt-12 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="infographic-loading-card relative h-36 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="h-3 w-20 rounded-full bg-slate-200" /><div className="mt-5 h-8 w-28 rounded-xl bg-slate-200" /><div className="infographic-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" /></div>)}</div><div className="mt-6 grid w-full gap-6 lg:grid-cols-2">{Array.from({ length: 2 }).map((_, index) => <div key={index} className="infographic-loading-card relative h-80 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="h-4 w-44 rounded-full bg-slate-200" /><div className="mt-6 h-52 rounded-2xl bg-slate-100" /><div className="infographic-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" /></div>)}</div></div></div>
}
