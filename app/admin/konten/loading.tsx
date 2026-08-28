"use client"

import { useEffect, useRef } from "react"

const Skeleton = ({ className }: { className: string }) => <span className={`block rounded-xl bg-slate-200 ${className}`} />

export default function KontenLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-konten-loading-intro]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.46 })
          .fromTo("[data-konten-loading-shell]", { autoAlpha: 0, y: 24, scale: 0.986 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.52 }, "-=0.25")
          .fromTo("[data-konten-loading-option]", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.28, stagger: 0.05 }, "-=0.2")
          .fromTo("[data-konten-loading-panel]", { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.18")
        gsap.to("[data-konten-loading-shimmer]", { xPercent: 245, duration: 1.25, stagger: 0.1, repeat: -1, ease: "none" })
        gsap.to("[data-konten-loading-orb]", { x: 18, y: -12, scale: 1.14, duration: 3.9, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })
    return () => { cancelled = true; context?.revert() }
  }, [])

  const option = (index: number) => <div key={index} data-konten-loading-option className="relative overflow-hidden rounded-2xl border border-slate-200 p-4"><Skeleton className="h-4 w-28" /><Skeleton className="mt-3 h-3 w-12 bg-emerald-100" /><Skeleton className="mt-3 h-3 w-full bg-slate-100" /><Skeleton className="mt-2 h-3 w-4/5 bg-slate-100" /><span data-konten-loading-shimmer className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/75 to-transparent" /></div>
  const field = (index: number) => <div key={index}><Skeleton className="h-3 w-28" /><Skeleton className="mt-2 h-11 w-full bg-slate-100" /></div>

  return <section ref={root} aria-busy="true" aria-live="polite" aria-label="Memuat editor tampilan halaman" className="py-1 sm:py-2"><p className="sr-only" role="status">Memuat editor tampilan halaman</p><header data-konten-loading-intro><Skeleton className="h-3 w-24 bg-emerald-100" /><Skeleton className="mt-3 h-10 w-72 max-w-full" /><Skeleton className="mt-3 h-4 max-w-xl bg-slate-100" /></header><section data-konten-loading-shell className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/[.06] sm:p-6"><div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]"><aside><Skeleton className="h-3 w-28 bg-emerald-100" /><div className="mt-3 space-y-2">{Array.from({ length: 6 }, (_, index) => option(index))}</div></aside><div data-konten-loading-panel className="min-w-0"><div className="relative overflow-hidden rounded-2xl bg-slate-950 p-5"><span data-konten-loading-orb className="absolute -right-8 -top-10 size-36 rounded-full bg-emerald-400/20 blur-2xl" /><Skeleton className="relative h-3 w-32 bg-emerald-300/30" /><Skeleton className="relative mt-4 h-8 w-48 bg-white/15" /><Skeleton className="relative mt-3 h-4 max-w-xl bg-white/10" /><Skeleton className="relative mt-2 h-4 w-4/5 max-w-lg bg-white/10" /></div><div className="mt-5 overflow-hidden rounded-2xl border border-slate-200"><div className="relative h-48 bg-emerald-950 p-5"><Skeleton className="h-3 w-28 bg-emerald-200/20" /><Skeleton className="mt-8 h-6 w-3/5 bg-white/15" /><Skeleton className="mt-3 h-4 w-4/5 bg-white/10" /></div><div className="p-5"><Skeleton className="h-5 w-32" /><Skeleton className="mt-2 h-3 w-80 max-w-full bg-slate-100" /><div className="mt-5 grid gap-4 md:grid-cols-2">{Array.from({ length: 4 }, (_, index) => field(index))}</div></div></div><div className="mt-5 rounded-2xl border border-slate-200 p-5"><Skeleton className="h-5 w-40" /><div className="mt-5 grid gap-4 md:grid-cols-2">{Array.from({ length: 4 }, (_, index) => field(index))}</div></div></div></div></section></section>
}
