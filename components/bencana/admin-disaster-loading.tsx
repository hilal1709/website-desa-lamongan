"use client"

import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { HugeiconsIcon } from "@hugeicons/react"
import ShieldAlertIcon from "@hugeicons/core-free-icons/ShieldAlertIcon"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function Shimmer({ className }: { className: string }) {
  return <div className={`relative overflow-hidden rounded-full bg-slate-200/90 ${className}`}><span data-admin-loading-shimmer className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" /></div>
}

export function AdminDisasterLoading() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const context = gsap.context(() => {
      gsap.fromTo("[data-admin-loading-card]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.08, ease: "power3.out" })
      gsap.to("[data-admin-loading-shimmer]", { xPercent: 260, duration: 1.2, repeat: -1, ease: "none", stagger: 0.12 })
      gsap.to("[data-admin-loading-pulse]", { scale: 1.16, opacity: 0.25, duration: 1.55, repeat: -1, yoyo: true, ease: "sine.inOut" })
    }, root)
    return () => context.revert()
  }, [])

  return <section aria-busy="true" aria-label="Memuat pengelolaan bencana" className="min-h-screen bg-slate-50 px-3 py-4 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
    <div ref={root} className="mx-auto max-w-4xl space-y-5 sm:space-y-7">
      <header data-admin-loading-card className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-800 p-5 text-white shadow-lg shadow-emerald-900/15 sm:p-8 lg:p-9">
        <div data-admin-loading-pulse className="absolute -right-10 -top-12 size-44 rounded-full border border-white/25" />
        <span className="relative grid size-12 place-items-center rounded-2xl bg-white/15"><HugeiconsIcon icon={ShieldAlertIcon} className="size-6" aria-hidden="true" /></span>
        <div className="mt-5 space-y-3"><div className="h-8 w-72 max-w-[85%] rounded-full bg-white/25" /><div className="h-4 w-full max-w-xl rounded-full bg-white/15" /><div className="h-4 w-4/5 max-w-md rounded-full bg-white/15" /></div>
      </header>

      <Card data-admin-loading-card className="overflow-hidden border-slate-200/80 shadow-lg shadow-slate-200/40"><CardContent className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"><div><Shimmer className="h-3 w-28 bg-emerald-100" /><Shimmer className="mt-3 h-7 w-80 max-w-full" /><Shimmer className="mt-3 h-4 w-full max-w-xl" /></div><div className="flex gap-3"><div className="h-16 w-20 rounded-2xl bg-slate-100" /><div className="h-16 w-20 rounded-2xl bg-emerald-50" /></div></CardContent></Card>

      <Card data-admin-loading-card className="border-slate-200/80"><CardHeader><Shimmer className="h-5 w-56" /><Shimmer className="mt-2 h-3 w-72 max-w-full bg-slate-100" /></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="size-9 rounded-xl bg-slate-100" /><Shimmer className="mt-4 h-4 w-20" /><Shimmer className="mt-2 h-3 w-full bg-slate-100" /></div>)}</div></CardContent></Card>

      <Card data-admin-loading-card className="border-slate-200/80"><CardHeader><Shimmer className="h-5 w-48" /><Shimmer className="mt-2 h-3 w-80 max-w-full bg-slate-100" /></CardHeader><CardContent><div className="h-32 rounded-xl border border-slate-200 bg-slate-50" /></CardContent></Card>

      <Card data-admin-loading-card className="border-slate-200/80"><CardHeader className="flex-col items-stretch gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between"><div><Shimmer className="h-5 w-48" /><Shimmer className="mt-2 h-3 w-72 max-w-full bg-slate-100" /></div><div className="h-9 w-full rounded-lg border border-emerald-100 bg-emerald-50 sm:w-28" /></CardHeader><CardContent><div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"><div className="h-4 w-24 rounded-full bg-slate-200" /><div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index}><div className="h-3 w-20 rounded-full bg-slate-200" /><div className="mt-2 h-12 rounded-xl border border-slate-200 bg-white" /></div>)}</div></div></CardContent></Card>
    </div>
  </section>
}
