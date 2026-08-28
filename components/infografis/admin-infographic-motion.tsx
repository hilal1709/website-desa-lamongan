"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function AdminInfographicMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanups: (() => void)[] = []

    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        const sections = gsap.utils.toArray<HTMLElement>("[data-cms-infographic-section]", root.current)
        const steps = gsap.utils.toArray<HTMLElement>("[data-cms-infographic-step]", root.current)

        gsap.fromTo("[data-cms-infographic-hero]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" })
        gsap.fromTo(steps, { autoAlpha: 0, y: 14, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.46, stagger: 0.09, delay: 0.16, ease: "back.out(1.5)" })
        gsap.to("[data-cms-infographic-orb]", { x: 24, y: 18, scale: 1.14, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to("[data-cms-infographic-orb-secondary]", { x: -16, y: 12, scale: 1.08, duration: 5.1, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to("[data-cms-infographic-line]", { scaleX: 1, duration: 0.8, stagger: 0.12, delay: 0.28, ease: "power3.out", transformOrigin: "left center" })

        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            gsap.to(entry.target, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" })
            observer?.unobserve(entry.target)
          })
        }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" })
        sections.forEach((section) => {
          gsap.set(section, { autoAlpha: 0, y: 20 })
          observer?.observe(section)
        })

        gsap.utils.toArray<HTMLElement>("[data-cms-infographic-step]", root.current).forEach((card) => {
          const enter = () => gsap.to(card, { y: -5, scale: 1.015, duration: 0.22, ease: "power2.out", overwrite: "auto" })
          const leave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" })
          card.addEventListener("pointerenter", enter)
          card.addEventListener("pointerleave", leave)
          cleanups.push(() => { card.removeEventListener("pointerenter", enter); card.removeEventListener("pointerleave", leave) })
        })
      }, root)
    })

    return () => { cancelled = true; observer?.disconnect(); cleanups.forEach((cleanup) => cleanup()); context?.revert() }
  }, [])

  return <div ref={root}>{children}</div>
}
