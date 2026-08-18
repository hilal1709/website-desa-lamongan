"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function DisasterPageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const animationFrame = window.requestAnimationFrame(() => {
      void import("gsap").then(({ default: gsap }) => {
        if (!root.current || cancelled) return

        context = gsap.context(() => {
          const main = root.current?.querySelector("main")
          const elements = main
            ? Array.from(main.children).filter(
                (element): element is HTMLElement => element instanceof HTMLElement && element.hasAttribute("data-disaster-motion"),
              )
            : []

          observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              const target = entry.target as HTMLElement
              gsap.to(target, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.68,
                delay: Number(target.dataset.motionDelay ?? 0),
                ease: "power3.out",
              })
              observer?.unobserve(target)
            })
          }, { threshold: 0.08, rootMargin: "0px 0px -6%" })

          elements.forEach((element, index) => {
            gsap.set(element, {
              autoAlpha: 0,
              y: element.dataset.motionKind === "map" ? 18 : 28,
              scale: element.dataset.motionKind === "map" ? 0.99 : 0.985,
            })
            element.dataset.motionDelay = String(Math.min(index * 0.06, 0.3))
            observer?.observe(element)
          })

          gsap.utils.toArray<HTMLElement>("[data-disaster-float]", root.current).forEach((element, index) => {
            gsap.to(element, {
              y: index % 2 === 0 ? -5 : 5,
              duration: 2.2 + index * 0.18,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            })
          })
        }, root)
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(animationFrame)
      observer?.disconnect()
      context?.revert()
    }
  }, [])

  return <div ref={root}>{children}</div>
}
