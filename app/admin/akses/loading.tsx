"use client"

import { useEffect, useRef, type ReactNode } from "react"

const Skeleton = ({ className = "" }: { className?: string }) => <span className={`block rounded-xl bg-slate-200 ${className}`} />

export default function AccessLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-access-loading-header]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .4 })
          .fromTo("[data-access-loading-stat]", { autoAlpha: 0, y: 12, scale: .92 }, { autoAlpha: 1, y: 0, scale: 1, duration: .34, stagger: .07, ease: "back.out(1.5)" }, "-=.2")
          .fromTo("[data-access-loading-panel]", { autoAlpha: 0, y: 18, scale: .985 }, { autoAlpha: 1, y: 0, scale: 1, duration: .4, stagger: .08 }, "-=.12")
        gsap.to("[data-access-loading-shimmer]", { xPercent: 240, duration: 1.25, stagger: .1, repeat: -1, ease: "none" })
        gsap.to("[data-access-loading-orb]", { x: 19, y: -12, scale: 1.14, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to("[data-access-loading-orb-secondary]", { x: -14, y: 15, scale: 1.1, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })
    return () => { cancelled = true; context?.revert() }
  }, [])

  const panel = (children: ReactNode, className = "") => <section data-access-loading-panel className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}<span data-access-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent" /></section>
  const field = (wide = false) => <div className={wide ? "sm:col-span-2" : ""}><Skeleton className="h-3 w-24" /><Skeleton className="mt-2 h-12 w-full bg-slate-100" /></div>

  return <main ref={root} aria-busy="true" aria-live="polite" className="relative space-y-5 overflow-hidden py-1 sm:py-2"><p className="sr-only" role="status">Memuat akun dan hak akses</p><span data-access-loading-orb className="pointer-events-none absolute -right-16 top-12 size-44 rounded-full bg-emerald-300/20 blur-3xl" /><span data-access-loading-orb-secondary className="pointer-events-none absolute left-1/3 top-96 size-36 rounded-full bg-sky-300/20 blur-3xl" />
    <header data-access-loading-header className="relative"><Skeleton className="h-3 w-28 bg-emerald-100" /><Skeleton className="mt-3 h-9 w-64 max-w-full" /><Skeleton className="mt-3 h-4 w-full max-w-2xl" /><Skeleton className="mt-2 h-4 w-4/5 max-w-xl" /></header>
    <div className="relative grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div data-access-loading-stat key={index} className="rounded-2xl border border-white/70 bg-white/85 p-3 shadow-sm"><div className="flex items-center gap-3"><Skeleton className="size-9 rounded-xl bg-emerald-100" /><div className="flex-1"><Skeleton className="h-5 w-10" /><Skeleton className="mt-2 h-3 w-28 bg-slate-100" /></div></div></div>)}</div>
    <div className="relative grid gap-5 xl:grid-cols-[1.18fr_.82fr]">{panel(<><div className="flex gap-3"><Skeleton className="size-11 rounded-2xl bg-emerald-100" /><div><Skeleton className="h-5 w-44" /><Skeleton className="mt-2 h-4 w-72 max-w-full bg-slate-100" /></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{field()}{field()}</div><div className="mt-6 space-y-2">{Array.from({ length: 7 }, (_, index) => <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><Skeleton className="h-4 w-36" /><Skeleton className="mt-2 h-3 w-52 max-w-full bg-slate-100" /><div className="mt-3 flex gap-2"><Skeleton className="h-7 w-16 bg-white" /><Skeleton className="h-7 w-16 bg-white" /><Skeleton className="h-7 w-16 bg-white" /></div></div>)}</div><Skeleton className="mt-5 h-11 w-36 bg-emerald-100" /></>)}{panel(<><div className="flex gap-3"><Skeleton className="size-11 rounded-2xl bg-slate-200" /><div><Skeleton className="h-5 w-40" /><Skeleton className="mt-2 h-4 w-56 bg-slate-100" /></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{field(true)}{field()}{field()} {field(true)}</div><Skeleton className="mt-6 h-4 w-28" /><div className="mt-3 space-y-2">{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} className="h-14 w-full bg-slate-100" />)}</div><Skeleton className="mt-5 h-11 w-full bg-slate-200" /></>)}</div>
    <div className="relative grid gap-5 xl:grid-cols-[.78fr_1.22fr]">{panel(<><Skeleton className="h-5 w-36" /><Skeleton className="mt-2 h-4 w-52 bg-slate-100" /><div className="mt-5 space-y-2">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-16 w-full bg-slate-100" />)}</div></>)}{panel(<><Skeleton className="h-5 w-36" /><Skeleton className="mt-2 h-4 w-64 bg-slate-100" /><div className="mt-5 space-y-3">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-16 w-full bg-slate-100" />)}</div></>)}</div>
  </main>
}
