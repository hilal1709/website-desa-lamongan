"use client"

import { useLayoutEffect, useRef } from "react"

export function PublicDataLoading() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.from("[data-public-data-loading]", { autoAlpha: 0, y: 12, duration: 0.36, stagger: 0.07, ease: "power3.out" })
        gsap.to("[data-public-data-pulse]", { autoAlpha: 0.4, duration: 0.8, stagger: 0.08, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })
    return () => { cancelled = true; context?.revert() }
  }, [])

  return <section ref={root} aria-busy="true" aria-live="polite" className="mt-6"><p className="sr-only" role="status">Memuat data & infografis desa</p><div data-public-data-loading><span data-public-data-pulse className="block h-3 w-24 rounded-full bg-emerald-100" /><span data-public-data-pulse className="mt-3 block h-8 w-72 max-w-full rounded-xl bg-slate-200" /><span data-public-data-pulse className="mt-3 block h-4 w-full max-w-lg rounded-lg bg-slate-200" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <article key={index} data-public-data-loading className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><span data-public-data-pulse className="block size-5 rounded bg-emerald-100" /><span data-public-data-pulse className="mt-4 block h-8 w-20 rounded-lg bg-slate-200" /><span data-public-data-pulse className="mt-3 block h-4 w-28 rounded-lg bg-slate-200" /></article>)}</div><div className="mt-5 grid gap-5 xl:grid-cols-2">{Array.from({ length: 2 }).map((_, index) => <article key={index} data-public-data-loading className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><span data-public-data-pulse className="block h-5 w-40 rounded-lg bg-slate-200" /><span data-public-data-pulse className="mt-3 block h-4 w-64 max-w-full rounded-lg bg-slate-200" /><span data-public-data-pulse className="mt-6 block h-52 rounded-2xl bg-slate-100" /></article>)}</div></section>
}
