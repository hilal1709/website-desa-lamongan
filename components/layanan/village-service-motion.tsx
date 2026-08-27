"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function VillageServiceMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanup: Array<() => void> = []
    const loadMotion = () => Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (!root.current || cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".service-catalog-card")
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline
          .from(".service-catalog-kicker", { autoAlpha: 0, x: -18, duration: 0.45 })
          .from(".service-catalog-heading h2, .service-catalog-heading p", { autoAlpha: 0, y: 22, duration: 0.58, stagger: 0.1 }, "-=0.2")
          .from(".service-catalog-summary", { autoAlpha: 0, y: 18, duration: 0.5 }, "-=0.35")
        gsap.from(cards, { autoAlpha: 0, y: 38, scale: 0.96, duration: 0.62, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".service-catalog-grid", start: "top 82%", once: true } })
        gsap.from(".service-tracking-panel", { autoAlpha: 0, y: 34, scale: 0.98, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".service-tracking-panel", start: "top 86%", once: true } })
        gsap.to(".service-tracking-glow", { x: 45, y: -16, scale: 1.15, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1 })
        gsap.to(".service-catalog-spark", { y: -10, opacity: 0.85, duration: 1.8, stagger: 0.2, ease: "sine.inOut", yoyo: true, repeat: -1 })
        cards.forEach((card) => {
          const icon = card.querySelector(".service-card-icon")
          const arrow = card.querySelector(".service-card-arrow")
          const enter = () => { gsap.to(card, { y: -8, rotateX: 2, rotateY: -2, transformPerspective: 1000, duration: 0.25, ease: "power2.out", overwrite: "auto" }); gsap.to(icon, { rotate: -10, scale: 1.1, duration: 0.25, overwrite: "auto" }); gsap.to(arrow, { x: 4, y: -3, duration: 0.22, overwrite: "auto" }) }
          const leave = () => { gsap.to(card, { y: 0, rotateX: 0, rotateY: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" }); gsap.to(icon, { rotate: 0, scale: 1, duration: 0.3, overwrite: "auto" }); gsap.to(arrow, { x: 0, y: 0, duration: 0.25, overwrite: "auto" }) }
          card.addEventListener("mouseenter", enter); card.addEventListener("mouseleave", leave)
          cleanup.push(() => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave) })
        })
      }, root)
    })
    const schedule = window.requestIdleCallback ?? ((callback: IdleRequestCallback) => window.setTimeout(callback, 180) as unknown as number)
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const idleId = schedule(() => { void loadMotion() })
    return () => { cancelled = true; cancel(idleId); cleanup.forEach((dispose) => dispose()); context?.revert() }
  }, [])
  return <div ref={root}>{children}</div>
}
