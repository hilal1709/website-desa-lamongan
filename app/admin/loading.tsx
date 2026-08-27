"use client"

import { useEffect, useRef, type ReactNode } from "react"

const Skeleton = ({ className }: { className: string }) => <div className={`rounded-xl bg-slate-200 ${className}`} />

export default function AdminLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const timer = window.setTimeout(() => void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-admin-loading-hero]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.42 })
          .fromTo("[data-admin-loading-card]", { autoAlpha: 0, y: 14, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.06 }, "-=0.16")
        gsap.to("[data-admin-loading-shimmer]", { xPercent: 240, duration: 1.2, stagger: 0.1, repeat: -1, ease: "none" })
        gsap.to("[data-admin-loading-dot]", { y: -5, duration: 0.42, stagger: 0.1, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    }), 80)
    return () => { cancelled = true; window.clearTimeout(timer); context?.revert() }
  }, [])

  const card = (index: number, content: ReactNode) => <article key={index} data-admin-loading-card className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{content}<span data-admin-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent" /></article>
  return <section ref={root} aria-busy="true" aria-live="polite" className="py-1 sm:py-2">
    <p className="sr-only" role="status">Memuat dashboard CMS</p>
    <header data-admin-loading-hero className="relative overflow-hidden rounded-[28px] bg-slate-950 px-5 py-6 sm:px-7 sm:py-7"><div className="flex gap-2"><span data-admin-loading-dot className="size-2.5 rounded-full bg-emerald-300" /><span data-admin-loading-dot className="size-2.5 rounded-full bg-emerald-300" /><span data-admin-loading-dot className="size-2.5 rounded-full bg-emerald-300" /></div><Skeleton className="mt-7 h-10 max-w-sm bg-white/15" /><Skeleton className="mt-4 h-5 max-w-xl bg-white/10" /></header>
    <section className="mt-5 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm sm:p-6"><Skeleton className="h-6 w-52" /><Skeleton className="mt-3 h-4 max-w-md" /><div className="mt-5 grid gap-4 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => card(index, <><Skeleton className="size-10 bg-emerald-100" /><Skeleton className="mt-4 h-5 w-3/4" /><Skeleton className="mt-3 h-4 w-full" /><Skeleton className="mt-2 h-4 w-4/5" /></>))}</div></section>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }, (_, index) => card(index, <><Skeleton className="size-11 bg-emerald-100" /><Skeleton className="mt-5 h-8 w-20" /><Skeleton className="mt-3 h-4 w-32" /></>))}</div>
    <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><Skeleton className="h-6 w-56" /><div className="mt-6 grid gap-5 md:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index}><Skeleton className="h-4 w-28" /><Skeleton className="mt-3 h-3 w-full rounded-full bg-slate-100" /></div>)}</div></section>
  </section>
}
