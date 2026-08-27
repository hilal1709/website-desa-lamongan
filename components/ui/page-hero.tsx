"use client"

import Image from "next/image"
import { useLayoutEffect, useRef } from "react"

interface PageHeroProps {
  eyebrow: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  imagePosition?: string
  overlayClassName?: string
}

export function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/dorr.jpg",
  imageAlt = "",
  imagePosition = "center",
  overlayClassName = "bg-[linear-gradient(90deg,rgba(4,18,15,0.76),rgba(8,34,23,0.56),rgba(8,36,19,0.42)),linear-gradient(180deg,rgba(5,24,18,0.22),rgba(5,24,18,0.3)_42%,rgba(5,24,18,0.7))]",
}: PageHeroProps) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined

    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return

      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })

        timeline
          .from(".page-hero-image", { scale: 1.08, opacity: 0.72, duration: 1.2 })
          .from(".page-hero-overlay", { opacity: 0, duration: 0.8 }, "<")
          .from(".page-hero-eyebrow", { opacity: 0, y: 18, duration: 0.55 }, "-=0.55")
          .from(".page-hero-title", { opacity: 0, y: 34, duration: 0.75 }, "-=0.35")
          .from(".page-hero-description", { opacity: 0, y: 24, duration: 0.65 }, "-=0.45")
      }, root)
    })

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [])

  return (
    <section ref={root} className="relative -mt-[88px] flex min-h-[480px] items-center overflow-hidden bg-[#071b1d] px-4 pb-12 pt-[144px] text-white sm:min-h-[600px] sm:px-6 sm:pb-20 sm:pt-[168px] lg:min-h-[640px] lg:px-8">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="page-hero-image object-cover" style={{ objectPosition: imagePosition }} />
      <div className={`page-hero-overlay absolute inset-0 ${overlayClassName}`} />

      <div className="relative mx-auto max-w-7xl">
        <p className="page-hero-eyebrow text-xs font-bold uppercase tracking-[0.16em] text-emerald-300 sm:text-sm sm:tracking-[0.2em]">{eyebrow}</p>
        <h1 className="page-hero-title mt-3 max-w-3xl text-3xl font-black tracking-tight sm:mt-4 sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="page-hero-description mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:mt-5 sm:text-lg sm:leading-8">{description}</p>
      </div>
    </section>
  )
}
