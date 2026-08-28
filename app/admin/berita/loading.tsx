"use client"

import { useEffect, useRef } from "react"

const Shimmer = ({ className }: { className: string }) => <div className={`relative overflow-hidden rounded-xl bg-slate-200 ${className}`}><span data-news-loading-shimmer aria-hidden="true" className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" /></div>

export default function NewsAdminLoading() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!rootRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!rootRef.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-news-loading-header]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .38 })
          .fromTo("[data-news-loading-hero]", { autoAlpha: 0, y: 18, scale: .985 }, { autoAlpha: 1, y: 0, scale: 1, duration: .42 }, "-=.16")
          .fromTo("[data-news-loading-panel]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .34, stagger: .1 }, "-=.2")
        gsap.to("[data-news-loading-shimmer]", { xPercent: 245, duration: 1.25, stagger: .11, repeat: -1, ease: "none" })
        gsap.to("[data-news-loading-orb]", { x: 18, y: -12, scale: 1.1, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, rootRef)
    })
    return () => context?.revert()
  }, [])

  return <section ref={rootRef} aria-busy="true" aria-live="polite" className="py-1 sm:py-2">
    <p className="sr-only" role="status">Memuat pengelolaan berita</p>
    <header data-news-loading-header><Shimmer className="h-3 w-24 bg-emerald-100" /><Shimmer className="mt-3 h-10 w-72 max-w-full" /><Shimmer className="mt-3 h-5 max-w-xl" /></header>
    <section data-news-loading-hero className="relative mt-5 overflow-hidden rounded-[28px] bg-slate-950 px-5 py-6 shadow-xl shadow-slate-950/15 sm:px-7 sm:py-7"><span data-news-loading-orb aria-hidden="true" className="absolute -right-10 -top-12 size-48 rounded-full bg-emerald-400/20 blur-3xl" /><div className="relative"><Shimmer className="h-3 w-28 bg-emerald-300/30" /><Shimmer className="mt-4 h-8 max-w-md bg-white/15" /><Shimmer className="mt-3 h-4 max-w-xl bg-white/10" /><div className="mt-6 grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="rounded-2xl border border-white/10 bg-white/[.07] px-4 py-3"><Shimmer className="size-9 bg-emerald-300/15" /><Shimmer className="mt-3 h-5 w-10 bg-white/15" /><Shimmer className="mt-2 h-3 w-20 bg-white/10" /></div>)}</div></div></section>
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><section data-news-loading-panel className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40"><div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><Shimmer className="h-6 w-36" /><Shimmer className="mt-2 h-3 w-52" /></div><Shimmer className="h-11 w-32 bg-emerald-100" /></div><div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-[minmax(0,1fr)_180px]"><Shimmer className="h-12" /><Shimmer className="h-12" /></div>{Array.from({ length: 5 }, (_, index) => <div key={index} className="flex items-center gap-4 border-b border-slate-100 p-4 sm:px-5"><Shimmer className="size-11 shrink-0" /><div className="flex-1"><Shimmer className="h-4 w-3/5" /><Shimmer className="mt-2 h-3 w-28" /></div><Shimmer className="size-10 shrink-0" /><Shimmer className="size-10 shrink-0" /></div>)}</section><aside data-news-loading-panel className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40"><Shimmer className="h-6 w-40" /><Shimmer className="mt-2 h-3 w-full" /><div className="mt-5 flex flex-wrap gap-2"><Shimmer className="h-8 w-24 bg-emerald-100" /><Shimmer className="h-8 w-28 bg-emerald-100" /><Shimmer className="h-8 w-20 bg-emerald-100" /></div><Shimmer className="mt-5 h-12" /><Shimmer className="mt-2 h-11 bg-slate-100" /></aside></div>
  </section>
}
