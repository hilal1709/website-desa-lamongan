"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

export function ProfileMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false

    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return

      context = gsap.context(() => {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return

              gsap.to(entry.target, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.72,
                delay: Number((entry.target as HTMLElement).dataset.motionDelay ?? 0),
                ease: "power3.out",
              })
              observer?.unobserve(entry.target)
            })
          },
          { threshold: 0.08, rootMargin: "0px 0px -8%" },
        )

        const reveal = (selector: string, from: Record<string, number> = {}) => {
          gsap.utils.toArray<HTMLElement>(selector, root.current).forEach((element, index) => {
            gsap.set(element, { autoAlpha: 0, y: 28, ...from })
            element.dataset.motionDelay = String(Math.min(index * 0.09, 0.36))
            observer?.observe(element)
          })
        }

        reveal(".profile-history-copy", { y: 24 })
        reveal(".profile-stat-card", { y: 22, scale: 0.97 })
        reveal(".profile-history-visual", { x: 30, scale: 0.97 })
        reveal(".profile-vision-card", { y: 34, scale: 0.985 })
        reveal(".profile-mission-item", { x: 22, y: 0 })
        reveal(".profile-structure-cta", { y: 26, scale: 0.985 })
        reveal(".profile-map", { y: 30, scale: 0.99 })
      }, root)
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      context?.revert()
    }
  }, [])

  return <div ref={root}>{children}</div>
}
