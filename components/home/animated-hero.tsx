"use client"

import { useLayoutEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { HomeArrowRightIcon, HomeMapPinIcon, HomeShieldCheckIcon, HomeSparklesIcon } from "@/components/home/home-icons"

import { Button } from "@/components/ui/button"
import type { CmsPageContent } from "@/lib/cms-pages"

export function AnimatedHero({ content }: { content: CmsPageContent }) {
  const root = useRef<HTMLDivElement>(null)
  const titleParts = content.title.includes(",") ? content.title.split(",") : [content.title]

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let ctx: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false

    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return

      ctx = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })

        timeline.from(".home-hero-image", { opacity: 0.72, scale: 1.08, duration: 1.3 })
        timeline.from(".hero-orbit", { opacity: 0, scale: 0.75, duration: 0.8, stagger: 0.12 }, "<0.15")
        gsap.from(".hero-animate", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1, ease: "power3.out" })
        gsap.from(".hero-badge", { opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(1.7)" })
        gsap.to(".hero-orbit-one", { x: 20, y: -18, duration: 5.5, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to(".hero-orbit-two", { x: -18, y: 16, duration: 6.5, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={root} className="home-hero relative isolate overflow-hidden bg-[#071b1d] text-white">
      <Image
        src={content.image}
        alt="Hamparan sawah Desa Kedungrejo"
        fill
        preload
        sizes="100vw"
        className="home-hero-image absolute inset-0 -z-20 h-full w-full object-cover opacity-100"
        style={{ objectPosition: content.imagePosition }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,24,20,0.88),rgba(5,47,32,0.62)_53%,rgba(6,37,25,0.28)),linear-gradient(180deg,rgba(5,24,18,0.16),rgba(5,24,18,0.26)_42%,rgba(5,24,18,0.74))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#f3f7f3] via-[#f3f7f3]/30 to-transparent" />
      <div className="hero-orbit hero-orbit-one pointer-events-none absolute right-[8%] top-[20%] h-48 w-48 rounded-full border border-emerald-100/20 bg-emerald-300/10 backdrop-blur-[2px] sm:h-64 sm:w-64" />
      <div className="hero-orbit hero-orbit-two pointer-events-none absolute bottom-[14%] right-[20%] h-20 w-20 rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-md" />

      <div className="mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-20 sm:min-h-[560px] sm:px-6 lg:min-h-[620px] lg:px-8">
        <div className="w-full">
          <div className="max-w-3xl">
            <div className="hero-badge mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/25 bg-emerald-300/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-50 backdrop-blur-md">
              <HomeSparklesIcon className="h-3.5 w-3.5 text-emerald-300" />
              {content.eyebrow}
            </div>

            <h1 className="hero-animate mt-4 max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {titleParts.length > 1 ? `${titleParts[0]},` : titleParts[0]}
              {titleParts.length > 1 ? <span className="block text-emerald-300">{titleParts.slice(1).join(",").trim()}</span> : null}
            </h1>

            <p className="hero-animate mt-4 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
              {content.description}
            </p>

            <div className="hero-animate mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="lg" className="w-full rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300 sm:w-auto">
                <Link href="/layanan">
                  Mulai layanan <HomeArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="w-full rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto">
                <Link href="/profil">
                  Jelajahi desa
                </Link>
              </Button>
            </div>

            <div className="hero-animate mt-10 flex flex-wrap items-center gap-3 text-sm text-slate-100">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
                <HomeShieldCheckIcon className="h-4 w-4 text-emerald-300" />
                Layanan cepat
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
                <HomeMapPinIcon className="h-4 w-4 text-emerald-300" />
                Lamongan, Jawa Timur
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
