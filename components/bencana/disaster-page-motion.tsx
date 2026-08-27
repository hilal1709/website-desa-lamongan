"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function DisasterPageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanup: Array<() => void> = []
    const animationFrame = window.requestAnimationFrame(() => {
      void import("gsap").then(({ default: gsap }) => {
        if (!root.current || cancelled) return

        context = gsap.context(() => {
          const elements = gsap.utils.toArray<HTMLElement>("[data-disaster-reveal]", root.current)

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
              y: element.dataset.disasterReveal === "map" ? 18 : 28,
              scale: element.dataset.disasterReveal === "map" ? 0.99 : 0.985,
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

          gsap.to("[data-disaster-orb]", { x: -18, y: 14, scale: 1.12, duration: 3.6, repeat: -1, yoyo: true, ease: "sine.inOut" })
          gsap.to("[data-disaster-pulse]", { scale: 1.2, autoAlpha: 0.45, duration: 0.85, repeat: -1, yoyo: true, ease: "sine.inOut" })

          gsap.utils.toArray<HTMLElement>(".disaster-command-card, .disaster-map-card, [data-disaster-hover]", root.current).forEach((element) => {
            const enter = () => gsap.to(element, { y: -4, scale: 1.003, duration: 0.24, ease: "power2.out", overwrite: "auto" })
            const leave = () => gsap.to(element, { y: 0, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" })
            element.addEventListener("mouseenter", enter)
            element.addEventListener("mouseleave", leave)
            cleanup.push(() => { element.removeEventListener("mouseenter", enter); element.removeEventListener("mouseleave", leave) })
          })

          const buttons = gsap.utils.toArray<HTMLElement>("button, a", root.current)
          buttons.forEach((button) => {
            const enter = () => gsap.to(button, { scale: 1.035, duration: 0.18, ease: "power2.out", overwrite: "auto" })
            const leave = () => gsap.to(button, { scale: 1, duration: 0.22, ease: "power2.out", overwrite: "auto" })
            button.addEventListener("mouseenter", enter)
            button.addEventListener("mouseleave", leave)
            cleanup.push(() => { button.removeEventListener("mouseenter", enter); button.removeEventListener("mouseleave", leave) })
          })

        }, root)
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(animationFrame)
      observer?.disconnect()
      cleanup.forEach((dispose) => dispose())
      context?.revert()
    }
  }, [])

  return <div ref={root}>{children}</div>
}
