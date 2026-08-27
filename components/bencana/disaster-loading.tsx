"use client"

import { useLayoutEffect, useRef } from "react"
import { DisasterCloudRainIcon, DisasterMapPinnedIcon, DisasterShieldCheckIcon } from "@/components/bencana/disaster-icons"
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
          .fromTo(".disaster-loading-card", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 }, "<.08")
        gsap.to(".disaster-loading-ring", { scale: 1.75, autoAlpha: 0, duration: 1.45, repeat: -1, ease: "power2.out" })
        gsap.to(".disaster-loading-shimmer", { xPercent: 185, duration: 1.25, repeat: -1, ease: "none" })
        gsap.to(".disaster-loading-map-dot", { scale: 1.25, autoAlpha: 0.45, duration: 0.78, stagger: 0.16, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })

    return () => { cancelled = true; context?.revert() }
  }, [])

  return (
    <main ref={root} className="min-h-[72vh] bg-slate-50 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center">
        <div className="relative grid h-16 w-16 place-items-center rounded-3xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15">
          <span className="disaster-loading-ring absolute inset-0 rounded-3xl border-2 border-emerald-400" />
          <DisasterMapPinnedIcon className="disaster-loading-icon h-7 w-7" />
        </div>
        <div className="disaster-loading-copy mt-5 text-center" role="status">
          <p className="text-lg font-black text-slate-900">Menyiapkan peta bencana</p>
          <p className="mt-1 text-sm text-slate-500">Memuat cuaca realtime dan titik lokasi terbaru</p>
        </div>
        <div className="mt-10 w-full space-y-6 sm:space-y-8">
          <Card className="disaster-loading-card relative overflow-hidden rounded-3xl border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 sm:rounded-[32px]">
            <CardContent className="flex items-center gap-3 p-5 sm:p-6">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-700 text-white"><DisasterShieldCheckIcon className="h-5 w-5" /></div>
              <div className="space-y-2"><div className="h-3 w-40 rounded-full bg-emerald-200" /><div className="h-3 w-64 max-w-[55vw] rounded-full bg-slate-200" /></div>
            </CardContent>
            <div className="disaster-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </Card>

          <Card className="disaster-loading-card relative overflow-hidden rounded-3xl border-slate-200 sm:rounded-[32px]">
            <CardContent className="p-5 sm:p-6"><div className="h-5 w-64 max-w-[70vw] rounded-full bg-slate-200" /><div className="mt-3 h-3 w-80 max-w-[85vw] rounded-full bg-slate-100" /><div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">{Array.from({ length: 7 }).map((_, index) => <div key={index} className="h-32 rounded-2xl border border-slate-100 bg-slate-50" />)}</div></CardContent>
            <div className="disaster-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <Card key={index} className="disaster-loading-card relative h-44 overflow-hidden rounded-3xl border-slate-200"><CardContent className="p-5"><DisasterCloudRainIcon className="h-5 w-5 text-emerald-700" /><div className="mt-5 h-4 w-28 rounded-full bg-slate-200" /><div className="mt-3 h-3 w-full rounded-full bg-slate-100" /><div className="mt-2 h-3 w-4/5 rounded-full bg-slate-100" /></CardContent><div className="disaster-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" /></Card>) }
          </div>

          <Card className="disaster-loading-card relative overflow-hidden rounded-3xl border-slate-200 sm:rounded-[32px]">
            <CardContent className="p-5 sm:p-6"><div className="h-5 w-52 rounded-full bg-slate-200" /><div className="mt-3 h-3 w-72 max-w-[80vw] rounded-full bg-slate-100" /><div className="relative mt-6 h-56 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#e2e8f0_25%,#f8fafc_25%,#f8fafc_50%,#e2e8f0_50%,#e2e8f0_75%,#f8fafc_75%)] bg-[length:28px_28px]"><span className="disaster-loading-map-dot absolute left-[24%] top-[32%] h-4 w-4 rounded-full bg-emerald-600 shadow-lg shadow-emerald-700/30" /><span className="disaster-loading-map-dot absolute left-[56%] top-[48%] h-4 w-4 rounded-full bg-blue-600 shadow-lg shadow-blue-700/30" /><span className="disaster-loading-map-dot absolute right-[17%] top-[25%] h-4 w-4 rounded-full bg-rose-600 shadow-lg shadow-rose-700/30" /></div></CardContent>
            <div className="disaster-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </Card>
        </div>
      </div>
    </main>
  )
}
