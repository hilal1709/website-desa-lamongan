"use client"

import { useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Baby01Icon from "@hugeicons/core-free-icons/Baby01Icon"
import Loading03Icon from "@hugeicons/core-free-icons/Loading03Icon"

export default function AdminChildHealthLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current) return
      context = gsap.context(() => {
        gsap.fromTo("[data-child-loading-panel]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.09, ease: "power3.out" })
        gsap.to("[data-child-loading-shimmer]", { xPercent: 220, duration: 1.2, stagger: 0.12, repeat: -1, ease: "none" })
        gsap.to("[data-child-loading-orb]", { x: 18, y: -12, duration: 3.6, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })
    return () => context?.revert()
  }, [])

  return <section ref={root} aria-busy="true" aria-label="Memuat rekam medis anak" className="mx-auto max-w-7xl space-y-5 py-1">
    <div data-child-loading-panel className="relative overflow-hidden rounded-[28px] bg-emerald-800 p-5 text-white shadow-lg shadow-emerald-950/15 sm:p-8">
      <span data-child-loading-orb className="absolute -right-10 -top-12 size-44 rounded-full bg-teal-300/15 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4"><div><span className="grid size-12 place-items-center rounded-2xl bg-white/15"><HugeiconsIcon icon={Baby01Icon} strokeWidth={1.8} className="size-6" aria-hidden="true" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Layanan kesehatan internal</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">Menyiapkan Rekam Medis Anak</h1><p className="mt-2 text-sm text-emerald-50">Memuat data bayi, balita, dan sesi posyandu...</p></div><HugeiconsIcon icon={Loading03Icon} strokeWidth={1.8} className="mt-1 size-7 animate-spin text-emerald-100" aria-hidden="true" /></div>
    </div>
    <div data-child-loading-panel className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2"><LoadingBar className="w-28 bg-emerald-700" /><LoadingBar className="w-32" /></div>
    <div data-child-loading-panel className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5"><LoadingBar className="h-5 w-44 bg-emerald-200" /><LoadingBar className="mt-3 w-80 max-w-full" /><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <LoadingBar key={index} className="h-11 w-full" />)}</div><LoadingBar className="mt-4 h-11 w-36 bg-emerald-200" /></div>
    <div data-child-loading-panel className="rounded-2xl border border-slate-200 bg-white p-4"><div className="grid gap-3 sm:grid-cols-[1fr_220px_auto]"><LoadingBar className="h-11 w-full" /><LoadingBar className="h-11 w-full" /><LoadingBar className="h-11 w-full bg-emerald-100" /></div></div>
    <div data-child-loading-panel className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><LoadingBar className="h-5 w-2/3 bg-slate-200" /><LoadingBar className="mt-3 w-full" /><LoadingBar className="mt-2 w-4/5" /><LoadingBar className="mt-5 h-8 w-24 bg-emerald-100" /></div>)}</div>
  </section>
}

function LoadingBar({ className = "" }: { className?: string }) { return <div className={`relative h-3 overflow-hidden rounded-full bg-slate-100 ${className}`}><span data-child-loading-shimmer className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/75 to-transparent" /></div> }
