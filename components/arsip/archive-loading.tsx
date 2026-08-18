"use client"

import { FileArchive } from "lucide-react"
import { useLayoutEffect, useRef } from "react"

export function ArchiveLoading() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-archive-loading-icon]", { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.45 })
          .fromTo("[data-archive-loading-copy]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.1")
          .fromTo("[data-archive-loading-card]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.07 }, "<0.08")
        gsap.to("[data-archive-loading-shimmer]", { xPercent: 220, duration: 1.25, repeat: -1, ease: "none" })
      }, root)
    })

    return () => { cancelled = true; context?.revert() }
  }, [])

  return (
    <div ref={root} aria-busy="true" aria-live="polite" className="min-h-screen bg-[#f3f7f3]">
      <section className="relative -mt-[88px] flex min-h-[480px] items-center overflow-hidden bg-emerald-950 px-4 pb-12 pt-[144px] text-white sm:min-h-[600px] sm:px-6 sm:pb-20 sm:pt-[168px] lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(52,211,153,0.22),transparent_34%),radial-gradient(circle_at_75%_80%,rgba(20,184,166,0.16),transparent_40%)]" />
        <div className="relative mx-auto w-full max-w-7xl">
          <div data-archive-loading-icon className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-950/20"><FileArchive size={27} /></div>
          <div data-archive-loading-copy className="mt-5"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-300">Keterbukaan informasi</p><h1 className="mt-3 text-3xl font-black sm:text-5xl">Menyiapkan arsip dokumen</h1><p className="mt-4 text-base text-slate-300">Mengambil daftar dokumen publik terbaru.</p></div>
        </div>
      </section>
      <section className="relative mx-auto -mt-8 max-w-7xl px-3 pb-14 sm:-mt-14 sm:px-6 sm:pb-20 lg:px-8">
        <div data-archive-loading-card className="relative overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-[0_22px_55px_rgba(7,49,37,0.12)] sm:p-6"><div className="h-12 rounded-xl bg-slate-100" /><div data-archive-loading-shimmer className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" /></div>
        <div data-archive-loading-card className="relative mt-5 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm sm:mt-7 sm:rounded-[2rem]"><div className="h-20 border-b border-slate-100 bg-slate-50 p-5"><div className="h-4 w-40 rounded-full bg-slate-200" /><div className="mt-2 h-3 w-28 rounded-full bg-slate-200" /></div>{Array.from({ length: 4 }).map((_, index) => <div key={index} className="flex flex-col gap-4 border-b border-slate-100 px-4 py-5 sm:flex-row sm:px-7"><div className="flex gap-4"><div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100" /><div className="flex-1"><div className="h-5 max-w-md rounded-full bg-slate-200" /><div className="mt-3 h-4 w-44 rounded-full bg-slate-100" /></div></div><div className="h-10 w-full rounded-xl bg-emerald-100 sm:ml-auto sm:w-28" /></div>)}<div data-archive-loading-shimmer className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" /></div>
      </section>
    </div>
  )
}
