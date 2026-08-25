"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function VillageServiceMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanup: Array<() => void> = []
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        const reveal = (selector: string, vars: gsap.TweenVars) => gsap.from(selector, { autoAlpha: 0, ...vars, ease: "power3.out", stagger: 0.09, duration: 0.65 })
        reveal(".service-catalog-heading", { y: 24 })
        reveal(".service-catalog-card", { y: 32, scale: 0.97 })
        reveal(".service-tracking-panel", { y: 28, scale: 0.985, delay: 0.2 })
        gsap.to(".service-tracking-glow", { x: 45, y: -16, scale: 1.15, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1 })
        gsap.utils.toArray<HTMLElement>(".service-catalog-card").forEach((card) => {
          const icon = card.querySelector(".service-card-icon")
          const enter = () => { gsap.to(card, { y: -8, duration: 0.25, ease: "power2.out", overwrite: "auto" }); gsap.to(icon, { rotate: -10, scale: 1.1, duration: 0.25, overwrite: "auto" }) }
          const leave = () => { gsap.to(card, { y: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" }); gsap.to(icon, { rotate: 0, scale: 1, duration: 0.3, overwrite: "auto" }) }
          card.addEventListener("mouseenter", enter); card.addEventListener("mouseleave", leave)
          cleanup.push(() => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave) })
        })
      }, root)
    })
    return () => { cancelled = true; cleanup.forEach((dispose) => dispose()); context?.revert() }
  }, [])
  return <div ref={root}>{children}</div>
}
