"use client"

import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

interface PageHeroProps {
  eyebrow: string
  title: string
  description: string
  image?: string
  imagePosition?: string
}

export function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/dorr.jpg",
  imagePosition = "center",
}: PageHeroProps) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!root.current) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })

      timeline
        .from(".page-hero-image", { scale: 1.08, opacity: 0.72, duration: 1.2 })
        .from(".page-hero-overlay", { opacity: 0, duration: 0.8 }, "<")
        .from(".page-hero-eyebrow", { opacity: 0, y: 18, duration: 0.55 }, "-=0.55")
        .from(".page-hero-title", { opacity: 0, y: 34, duration: 0.75 }, "-=0.35")
        .from(".page-hero-description", { opacity: 0, y: 24, duration: 0.65 }, "-=0.45")
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative -mt-[88px] flex min-h-[520px] items-center overflow-hidden bg-[#071b1d] px-5 pb-16 pt-[156px] text-white sm:min-h-[600px] sm:pb-20 sm:pt-[168px] lg:min-h-[640px]">
      <img src={image} alt="" className="page-hero-image absolute inset-0 h-full w-full object-cover" style={{ objectPosition: imagePosition }} />
      <div className="page-hero-overlay absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,15,0.76),rgba(8,34,23,0.56),rgba(8,36,19,0.42)),linear-gradient(180deg,rgba(5,24,18,0.22),rgba(5,24,18,0.3)_42%,rgba(5,24,18,0.7))]" />

      <div className="relative mx-auto max-w-7xl">
        <p className="page-hero-eyebrow text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">{eyebrow}</p>
        <h1 className="page-hero-title mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="page-hero-description mt-5 max-w-2xl text-lg leading-8 text-slate-300">{description}</p>
      </div>
    </section>
  )
}
