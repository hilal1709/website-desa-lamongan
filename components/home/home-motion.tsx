"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let ctx: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false

    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return

      ctx = gsap.context(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            gsap.to(entry.target, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              delay: Number((entry.target as HTMLElement).dataset.motionDelay ?? 0),
              ease: "power3.out",
            })
            observer?.unobserve(entry.target)
          })
        },
        { threshold: 0.08, rootMargin: "0px 0px -8%" },
      )

      const reveal = (selector: string, options: gsap.TweenVars = {}) => {
        const elements = gsap.utils.toArray<HTMLElement>(selector, root.current)

        elements.forEach((element, index) => {
          gsap.set(element, {
            autoAlpha: 0,
            y: 28,
            ...options,
          })
          element.dataset.motionDelay = String(Math.min(index * 0.08, 0.4))
          observer?.observe(element)
        })
      }

      reveal(".home-stat", { y: 20, duration: 0.55, stagger: 0.08 })
      reveal(".home-section-heading", { y: 22 })
      reveal(".home-service-card", { y: 32, stagger: 0.12 })
      reveal(".home-digital-card", { y: 28, stagger: 0.12 })
      reveal(".home-overview-card", { y: 28, stagger: 0.08 })
      reveal(".home-news-card", { y: 28, stagger: 0.12 })
      reveal(".home-cta", { y: 24, scale: 0.98, duration: 0.65 })
      }, root)
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      ctx?.revert()
    }
  }, [])

  return <div ref={root}>{children}</div>
}
