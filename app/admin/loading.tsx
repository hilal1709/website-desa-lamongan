"use client"

import { useLayoutEffect, useRef } from "react"

const Skeleton = ({ className }: { className: string }) => <div className={`rounded-xl bg-slate-200 ${className}`} />

export default function AdminLoading() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .from(".admin-loading-brand", { autoAlpha: 0, x: -16, duration: 0.42 })
          .from(".admin-loading-header", { autoAlpha: 0, y: 18, duration: 0.48 }, "-=0.2")
          .from(".admin-loading-card", { autoAlpha: 0, y: 16, scale: 0.985, duration: 0.36, stagger: 0.07 }, "-=0.25")
        gsap.to(".admin-loading-pulse", { scale: 1.18, autoAlpha: 0.35, duration: 1.15, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to(".admin-loading-shimmer", { xPercent: 260, duration: 1.25, stagger: 0.1, repeat: -1, ease: "none" })
        gsap.to(".admin-loading-dot", { y: -5, duration: 0.42, stagger: 0.1, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })

    return () => { cancelled = true; context?.revert() }
  }, [])

  return <main ref={root} aria-busy="true" aria-live="polite" className="py-1 sm:py-2">
    <p className="sr-only" role="status">Memuat CMS admin</p>
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="admin-loading-brand relative hidden min-h-[620px] overflow-hidden rounded-b-[28px] bg-slate-950 p-5 lg:block"><span className="admin-loading-pulse absolute left-8 top-8 size-24 rounded-full bg-emerald-400/20 blur-2xl" /><Skeleton className="h-14 w-44 bg-white/10" /><div className="mt-10 space-y-3">{Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-11 w-full bg-white/10" />)}</div></aside>
      <div>
        <section className="admin-loading-header relative overflow-hidden rounded-[28px] bg-slate-950 p-6 sm:p-7"><div className="flex gap-2"><span className="admin-loading-dot size-2.5 rounded-full bg-emerald-300" /><span className="admin-loading-dot size-2.5 rounded-full bg-emerald-300" /><span className="admin-loading-dot size-2.5 rounded-full bg-emerald-300" /></div><Skeleton className="mt-7 h-10 max-w-sm bg-white/15" /><Skeleton className="mt-4 h-5 max-w-xl bg-white/10" /></section>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <article key={index} className="admin-loading-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Skeleton className="size-11 bg-emerald-100" /><Skeleton className="mt-6 h-8 w-20" /><Skeleton className="mt-3 h-4 w-32" /><span aria-hidden className="admin-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent" /></article>)}</div>
        <div className="mt-6"><Skeleton className="h-7 w-48" /><div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <article key={index} className="admin-loading-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Skeleton className="size-11 bg-slate-100" /><Skeleton className="mt-6 h-5 w-3/4" /><Skeleton className="mt-4 h-4 w-full" /><Skeleton className="mt-2 h-4 w-4/5" /><span aria-hidden className="admin-loading-shimmer absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent" /></article>)}</div></div>
      </div>
    </div>
  </main>
}
