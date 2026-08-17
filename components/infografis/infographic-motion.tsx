"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

export function InfographicMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false

    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-infographic-motion]", root.current)
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            gsap.to(entry.target, { autoAlpha: 1, y: 0, scale: 1, duration: 0.62, ease: "power3.out" })
            observer?.unobserve(entry.target)
          })
        }, { threshold: 0.08, rootMargin: "0px 0px -6%" })

        cards.forEach((card, index) => {
          gsap.set(card, { autoAlpha: 0, y: 24, scale: 0.985 })
          card.style.transitionDelay = `${Math.min(index * 35, 180)}ms`
          observer?.observe(card)
        })
      }, root)
    })

    return () => { cancelled = true; observer?.disconnect(); context?.revert() }
  }, [])

  return <div ref={root}>{children}</div>
}
