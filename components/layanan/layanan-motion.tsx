"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function LayananMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let cancelled = false; let context: ReturnType<typeof import("gsap").default.context> | undefined; const cleanup: (() => void)[] = []
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".layanan-service-card")
        const steps = gsap.utils.toArray<HTMLElement>(".layanan-flow-step")
        gsap.from(cards, { y: 20, scale: .99, duration: .45, stagger: .07, ease: "power3.out" })
        gsap.to(".layanan-flow-accent", { xPercent: 130, duration: 2.4, repeat: -1, repeatDelay: .7, ease: "power1.inOut" })
        cards.forEach((card) => { const icon = card.querySelector(".layanan-service-icon"); const arrow = card.querySelector(".layanan-service-arrow"); const enter = () => { gsap.to(card, { y: -7, scale: 1.01, duration: .22, overwrite: "auto" }); gsap.to(icon, { rotate: -8, scale: 1.07, duration: .22, overwrite: "auto" }); gsap.to(arrow, { x: 4, y: -3, duration: .22, overwrite: "auto" }) }; const leave = () => { gsap.to(card, { x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1, duration: .32, overwrite: "auto" }); gsap.to(icon, { rotate: 0, scale: 1, duration: .25, overwrite: "auto" }); gsap.to(arrow, { x: 0, y: 0, duration: .25, overwrite: "auto" }) }; const move = (event: MouseEvent) => { const box = card.getBoundingClientRect(); gsap.to(card, { rotateY: ((event.clientX - box.left) / box.width - .5) * 4, rotateX: ((event.clientY - box.top) / box.height - .5) * -4, transformPerspective: 900, duration: .3, overwrite: "auto" }) }; card.addEventListener("mouseenter", enter); card.addEventListener("mouseleave", leave); card.addEventListener("mousemove", move); cleanup.push(() => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave); card.removeEventListener("mousemove", move) }) })
        steps.forEach((step) => { const enter = () => gsap.to(step, { x: 5, scale: 1.01, duration: .2, overwrite: "auto" }); const leave = () => gsap.to(step, { x: 0, scale: 1, duration: .28, overwrite: "auto" }); step.addEventListener("mouseenter", enter); step.addEventListener("mouseleave", leave); cleanup.push(() => { step.removeEventListener("mouseenter", enter); step.removeEventListener("mouseleave", leave) }) })
      }, root)
    })
    return () => { cancelled = true; cleanup.forEach((dispose) => dispose()); context?.revert() }
  }, [])
  return <section ref={root} className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">{children}</section>
}
