"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

export function NewsMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false

    const startAnimation = () => void import("gsap").then(({ default: gsap }) => {
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
                duration: 0.7,
                delay: Number((entry.target as HTMLElement).dataset.motionDelay ?? 0),
                ease: "power3.out",
              })
              observer?.unobserve(entry.target)
            })
          },
          { threshold: 0.08, rootMargin: "0px 0px -8%" },
        )

        const reveal = (selector: string, from: Record<string, number>) => {
          gsap.utils.toArray<HTMLElement>(selector, root.current).forEach((element, index) => {
            gsap.set(element, { autoAlpha: 0, ...from })
            element.dataset.motionDelay = String(Math.min(index * 0.1, 0.5))
            observer?.observe(element)
          })
        }

        reveal(".news-featured", { y: 36, scale: 0.985 })
        reveal(".news-popular", { x: 24, y: 0, scale: 0.985 })
        reveal(".news-filter", { y: 18 })
        reveal(".news-section-divider", { y: 18 })
        reveal(".news-card", { y: 30, scale: 0.975 })
        reveal(".news-pagination", { y: 14 })
        reveal(".news-empty-state", { y: 24, scale: 0.98 })
      }, root)
    })

    const animationTimer = window.setTimeout(startAnimation, 250)

    return () => {
      cancelled = true
      window.clearTimeout(animationTimer)
      observer?.disconnect()
      context?.revert()
    }
  }, [])

  return <div ref={root}>{children}</div>
}
