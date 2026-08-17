"use client"

import { useLayoutEffect, useRef } from "react"
import { CloudRain, MapPinned } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DisasterLoading() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false

    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(".disaster-loading-icon", { autoAlpha: 0, scale: 0.76 }, { autoAlpha: 1, scale: 1, duration: 0.5 })
          .fromTo(".disaster-loading-copy", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<.08")
          .fromTo(".disaster-loading-card", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1 }, "<.08")
        gsap.to(".disaster-loading-ring", { scale: 1.75, autoAlpha: 0, duration: 1.45, repeat: -1, ease: "power2.out" })
        gsap.to(".disaster-loading-shimmer", { xPercent: 185, duration: 1.25, repeat: -1, ease: "none" })
      }, root)
    })

    return () => { cancelled = true; context?.revert() }
  }, [])

  return (
    <main ref={root} className="min-h-[72vh] bg-slate-50 px-5 py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="relative grid h-16 w-16 place-items-center rounded-3xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15">
          <span className="disaster-loading-ring absolute inset-0 rounded-3xl border-2 border-emerald-400" />
          <MapPinned className="disaster-loading-icon h-7 w-7" aria-hidden="true" />
        </div>
        <div className="disaster-loading-copy mt-5 text-center" role="status">
          <p className="text-lg font-black text-slate-900">Menyiapkan peta bencana</p>
          <p className="mt-1 text-sm text-slate-500">Memuat cuaca realtime dan titik lokasi terbaru</p>
        </div>
        <div className="mt-10 grid w-full gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <Card className="disaster-loading-card relative h-64 overflow-hidden rounded-3xl border-slate-200">
            <CardContent className="p-6"><div className="h-5 w-48 rounded-full bg-slate-200" /><div className="mt-6 h-40 rounded-2xl bg-slate-100" /></CardContent>
            <div className="disaster-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </Card>
          <Card className="disaster-loading-card relative h-64 overflow-hidden rounded-3xl border-slate-200">
            <CardContent className="p-6"><CloudRain className="h-6 w-6 text-emerald-700" /><div className="mt-5 h-4 w-36 rounded-full bg-slate-200" /><div className="mt-4 h-20 rounded-2xl bg-slate-100" /></CardContent>
            <div className="disaster-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </Card>
        </div>
      </div>
    </main>
  )
}
