"use client"

import { useEffect, useRef } from "react"

const Skeleton = ({ className = "" }: { className?: string }) => <span className={`block rounded-xl bg-slate-200 ${className}`} />

export default function PengaturanLoading() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-settings-loading-header]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.38 })
          .fromTo("[data-settings-loading-hero]", { autoAlpha: 0, y: 18, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.44 }, "-=.18")
          .fromTo("[data-settings-loading-card]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.08 }, "-=.2")
        gsap.to("[data-settings-loading-shimmer]", { xPercent: 240, duration: 1.35, stagger: 0.12, repeat: -1, ease: "none" })
        gsap.to("[data-settings-loading-dot]", { y: -5, scale: 1.08, duration: 0.5, stagger: 0.1, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to("[data-settings-loading-orb]", { x: 18, y: 12, scale: 1.12, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })
    return () => { cancelled = true; context?.revert() }
  }, [])

  const card = (children: React.ReactNode, className = "") => <section data-settings-loading-card className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}<span data-settings-loading-shimmer aria-hidden className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent" /></section>

  return <main ref={root} aria-busy="true" aria-live="polite" className="py-1 sm:py-2"><p className="sr-only" role="status">Memuat pengaturan sistem</p>
    <header data-settings-loading-header><Skeleton className="h-3 w-24 bg-emerald-100" /><Skeleton className="mt-3 h-10 w-64 max-w-full" /><Skeleton className="mt-3 h-4 w-full max-w-2xl" /><Skeleton className="mt-2 h-4 w-4/5 max-w-xl" /></header>
    <section data-settings-loading-hero className="relative mt-6 overflow-hidden rounded-3xl bg-slate-950 p-5 sm:p-6"><span data-settings-loading-orb className="absolute -right-12 -top-14 size-48 rounded-full bg-emerald-400/20 blur-3xl" /><div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><Skeleton className="h-3 w-36 bg-emerald-300/30" /><Skeleton className="mt-3 h-7 w-72 max-w-full bg-white/20" /><Skeleton className="mt-3 h-4 w-96 max-w-full bg-white/10" /></div><div className="grid grid-cols-3 gap-2"><Skeleton className="h-16 w-20 bg-white/10" /><Skeleton className="h-16 w-20 bg-white/10" /><Skeleton className="h-16 w-20 bg-white/10" /></div></div></section>
    {card(<><div className="flex gap-4"><Skeleton className="size-11 rounded-2xl bg-emerald-100" /><div><Skeleton className="h-5 w-48" /><Skeleton className="mt-2 h-4 w-72 max-w-full bg-slate-100" /></div></div><div className="mt-6 grid gap-4 md:grid-cols-2">{Array.from({ length: 8 }, (_, index) => <div key={index} className={index === 0 || index === 4 || index === 7 ? "md:col-span-2" : ""}><Skeleton className="h-3 w-28" /><Skeleton className="mt-2 h-12 w-full bg-slate-100" /></div>)}</div></>)}
    <div className="mt-5 grid gap-5 xl:grid-cols-2">{card(<><div className="flex gap-4"><Skeleton className="size-11 rounded-2xl bg-amber-100" /><div><Skeleton className="h-5 w-40" /><Skeleton className="mt-2 h-4 w-56 bg-slate-100" /></div></div><Skeleton className="mt-6 h-20 w-full bg-slate-100" /><Skeleton className="mt-4 h-24 w-full bg-slate-100" /></>)}{card(<><div className="flex gap-4"><Skeleton className="size-11 rounded-2xl bg-rose-100" /><div><Skeleton className="h-5 w-40" /><Skeleton className="mt-2 h-4 w-56 bg-slate-100" /></div></div><Skeleton className="mt-6 h-3 w-36" /><Skeleton className="mt-2 h-36 w-full bg-slate-100" /></>)}</div>
    {card(<><div className="flex gap-4"><Skeleton className="size-11 rounded-2xl bg-sky-100" /><div><Skeleton className="h-5 w-36" /><Skeleton className="mt-2 h-4 w-72 bg-slate-100" /></div></div><div className="mt-6 grid gap-4 md:grid-cols-2">{Array.from({ length: 6 }, (_, index) => <div key={index} className={index === 0 || index === 4 ? "md:col-span-2" : ""}><Skeleton className="h-3 w-32" /><Skeleton className="mt-2 h-12 w-full bg-slate-100" /></div>)}</div></>, "mt-5")}
    <div className="mt-5 flex gap-2"><span data-settings-loading-dot className="size-2.5 rounded-full bg-emerald-400" /><span data-settings-loading-dot className="size-2.5 rounded-full bg-emerald-400" /><span data-settings-loading-dot className="size-2.5 rounded-full bg-emerald-400" /></div>
  </main>
}
