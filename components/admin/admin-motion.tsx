"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function AdminMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanups: (() => void)[] = []

    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        const reveal = gsap.utils.toArray<HTMLElement>("[data-admin-reveal]")
        const cards = gsap.utils.toArray<HTMLElement>("[data-admin-card]")

        gsap.set(reveal, { autoAlpha: 0, y: 16 })
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .to("[data-admin-sidebar]", { autoAlpha: 1, x: 0, duration: 0.45 })
          .to(reveal, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.06 }, "-=0.18")

        cards.forEach((card) => {
          const icon = card.querySelector("[data-admin-card-icon]")
          const arrow = card.querySelector("[data-admin-card-arrow]")
          const enter = () => {
            gsap.to(card, { y: -5, scale: 1.008, duration: 0.22, overwrite: "auto" })
            gsap.to(icon, { rotate: -8, scale: 1.08, duration: 0.22, overwrite: "auto" })
            gsap.to(arrow, { x: 4, duration: 0.22, overwrite: "auto" })
          }
          const leave = () => {
            gsap.to(card, { y: 0, scale: 1, duration: 0.3, overwrite: "auto" })
            gsap.to(icon, { rotate: 0, scale: 1, duration: 0.28, overwrite: "auto" })
            gsap.to(arrow, { x: 0, duration: 0.28, overwrite: "auto" })
          }
          card.addEventListener("mouseenter", enter)
          card.addEventListener("mouseleave", leave)
          cleanups.push(() => {
            card.removeEventListener("mouseenter", enter)
            card.removeEventListener("mouseleave", leave)
          })
        })
      }, root)
    })

    return () => {
      cancelled = true
      cleanups.forEach((cleanup) => cleanup())
      context?.revert()
    }
  }, [pathname])

  return <div ref={root}>{children}</div>
}
