"use client"

import { useLayoutEffect, useRef } from "react"

export function CmsPageMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanups: (() => void)[] = []

    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline
          .fromTo("[data-cms-intro]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.52 })
          .fromTo("[data-cms-shell]", { autoAlpha: 0, y: 26, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.58 }, "-=0.3")
          .fromTo("[data-cms-page-option]", { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.36, stagger: 0.045 }, "-=0.24")
          .fromTo("[data-cms-panel]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45 }, "-=0.2")

        gsap.to("[data-cms-hero-orb]", { x: 22, y: -12, scale: 1.16, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to("[data-cms-hero-orb-secondary]", { x: -18, y: 14, scale: 1.1, duration: 5.1, repeat: -1, yoyo: true, ease: "sine.inOut" })

        gsap.utils.toArray<HTMLElement>("[data-cms-page-option], [data-cms-section], [data-cms-action]", root.current).forEach((element) => {
          const enter = () => gsap.to(element, { y: -3, scale: 1.006, duration: 0.2, ease: "power2.out", overwrite: "auto" })
          const leave = () => gsap.to(element, { y: 0, scale: 1, duration: 0.28, ease: "power3.out", overwrite: "auto" })
          element.addEventListener("mouseenter", enter)
          element.addEventListener("mouseleave", leave)
          cleanups.push(() => { element.removeEventListener("mouseenter", enter); element.removeEventListener("mouseleave", leave) })
        })
      }, root)
    })

    return () => { cancelled = true; cleanups.forEach((cleanup) => cleanup()); context?.revert() }
  }, [])

  return <div ref={root}>{children}</div>
}
