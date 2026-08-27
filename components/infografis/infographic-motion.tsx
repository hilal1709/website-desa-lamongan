"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

export function InfographicMotion({ children, motionKey }: { children: ReactNode; motionKey: string }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const hoverCleanups: (() => void)[] = []

    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-infographic-motion]", root.current)
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const target = entry.target as HTMLElement
            gsap.to(target, {
              autoAlpha: 1,
              x: target.dataset.infographicMotion === "slide-right" ? 0 : 0,
              y: 0,
              scale: 1,
              duration: 0.62,
              ease: "power3.out",
            })
            observer?.unobserve(entry.target)
          })
        }, { threshold: 0.01, rootMargin: "0px 0px 20% 0px" })

        cards.forEach((card, index) => {
          gsap.set(card, { autoAlpha: 0, x: card.dataset.infographicMotion === "slide-right" ? 12 : 0, y: 14, scale: 0.99 })
          card.style.transitionDelay = `${Math.min(index * 35, 180)}ms`
          observer?.observe(card)
        })

        const tabs = gsap.utils.toArray<HTMLElement>("[aria-pressed], [role=tab]", root.current)
        gsap.fromTo(tabs, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.05, ease: "power2.out", delay: 0.08 })

        const charts = gsap.utils.toArray<HTMLElement>("canvas", root.current)
        gsap.fromTo(charts, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.52, stagger: 0.08, ease: "power3.out", delay: 0.16 })

        const interactiveCards = gsap.utils.toArray<HTMLElement>(".rounded-3xl", root.current)
        interactiveCards.forEach((card) => {
          const enter = () => gsap.to(card, { y: -4, duration: 0.22, ease: "power2.out", overwrite: true })
          const leave = () => gsap.to(card, { y: 0, duration: 0.26, ease: "power2.out", overwrite: true })
          card.addEventListener("pointerenter", enter)
          card.addEventListener("pointerleave", leave)
          hoverCleanups.push(() => { card.removeEventListener("pointerenter", enter); card.removeEventListener("pointerleave", leave) })
        })

        gsap.to("[data-infographic-accent]", { x: 18, y: 12, scale: 1.08, duration: 3.4, ease: "sine.inOut", repeat: -1, yoyo: true })
      }, root)
    })

    return () => { cancelled = true; observer?.disconnect(); hoverCleanups.forEach((cleanup) => cleanup()); context?.revert() }
  }, [motionKey])

  return <div ref={root} className="infographic-motion-root min-w-0">{children}</div>
}
