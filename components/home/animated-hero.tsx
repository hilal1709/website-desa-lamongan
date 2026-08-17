"use client"

import { useLayoutEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CmsPageContent } from "@/lib/cms-pages"

export function AnimatedHero({ content }: { content: CmsPageContent }) {
  const root = useRef<HTMLDivElement>(null)
  const titleParts = content.title.includes(",") ? content.title.split(",") : [content.title]

  useLayoutEffect(() => {
    if (!root.current) return

    let ctx: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false

    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return

      ctx = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })

        timeline.from(".home-hero-image", { opacity: 0.72, scale: 1.08, duration: 1.3 })
        gsap.from(".hero-animate", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1, ease: "power3.out" })
        gsap.from(".hero-badge", { opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(1.7)" })
      }, root)
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={root} className="relative isolate overflow-hidden bg-[#071b1d] text-white">
      <Image
        src={content.image}
        alt="Hamparan sawah Desa Kedungrejo"
        fill
        priority
        sizes="100vw"
        className="home-hero-image absolute inset-0 -z-20 h-full w-full object-cover opacity-100"
        style={{ objectPosition: content.imagePosition }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,18,15,0.72),rgba(8,34,23,0.52),rgba(8,36,19,0.38)),linear-gradient(180deg,rgba(5,24,18,0.18),rgba(5,24,18,0.26)_42%,rgba(5,24,18,0.66))]" />

      <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-16 sm:px-6 lg:min-h-[620px] lg:px-8">
        <div className="w-full">
          <div className="max-w-3xl">
            <div className="hero-badge mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-100 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              {content.eyebrow}
            </div>

            <h1 className="hero-animate mt-4 text-5xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {titleParts.length > 1 ? `${titleParts[0]},` : titleParts[0]}
              {titleParts.length > 1 ? <span className="block text-emerald-300">{titleParts.slice(1).join(",").trim()}</span> : null}
            </h1>

            <p className="hero-animate mt-4 max-w-xl text-lg leading-8 text-slate-200">
              {content.description}
            </p>

            <div className="hero-animate mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-2xl bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                <Link href="/layanan">
                  Mulai layanan <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link href="/profil">
                  Jelajahi desa
                </Link>
              </Button>
            </div>

            <div className="hero-animate mt-10 flex flex-wrap items-center gap-5 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Layanan cepat
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
