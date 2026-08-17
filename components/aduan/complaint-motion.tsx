"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

export function ComplaintMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!rootRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined

    void import("gsap").then(({ default: gsap }) => {
      if (!rootRef.current || cancelled) return

      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline
          .from(".complaint-intro", { autoAlpha: 0, y: 24, duration: 0.6 })
          .from(".complaint-form-card", { autoAlpha: 0, x: -32, scale: 0.985, duration: 0.75 }, "-=0.2")
          .from(".complaint-history", { autoAlpha: 0, x: 32, duration: 0.65 }, "-=0.58")
          .from(".complaint-field", { autoAlpha: 0, y: 16, duration: 0.42, stagger: 0.08 }, "-=0.35")
          .from(".complaint-submit", { autoAlpha: 0, y: 12, scale: 0.96, duration: 0.45 }, "-=0.12")
          .from(".complaint-row", { autoAlpha: 0, x: 18, duration: 0.42, stagger: 0.1 }, "-=0.36")

        gsap.to(".complaint-orb", { y: -10, x: 6, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.35 })
      }, rootRef)
    })

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [])

  return <main ref={rootRef} id="main-content" className="relative overflow-hidden bg-slate-50/70 px-3 py-10 sm:px-6 sm:py-16">{children}</main>
}
