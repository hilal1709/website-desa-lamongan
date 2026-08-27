"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function ComplaintMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!rootRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let observer: IntersectionObserver | undefined
    const cleanup: Array<() => void> = []

    void import("gsap").then(({ default: gsap }) => {
      if (!rootRef.current || cancelled) return

      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline
          .from(".complaint-intro", { autoAlpha: 0, y: 24, duration: 0.6 })
          .from(".complaint-step", { autoAlpha: 0, y: 20, scale: 0.96, duration: 0.45, stagger: 0.1 }, "-=0.35")
          .from(".complaint-form-card", { autoAlpha: 0, x: -32, scale: 0.985, duration: 0.75 }, "-=0.2")
          .from(".complaint-history", { autoAlpha: 0, x: 32, duration: 0.65 }, "-=0.58")
          .from(".complaint-field", { autoAlpha: 0, y: 16, duration: 0.42, stagger: 0.08 }, "-=0.35")
          .from(".complaint-submit", { autoAlpha: 0, y: 12, scale: 0.96, duration: 0.45 }, "-=0.12")
          .from(".complaint-row", { autoAlpha: 0, x: 18, duration: 0.42, stagger: 0.1 }, "-=0.36")

        gsap.to(".complaint-orb", { y: -10, x: 6, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.35 })
        gsap.to(".complaint-header-glow", { x: -12, y: 10, scale: 1.12, duration: 3.1, ease: "sine.inOut", yoyo: true, repeat: -1 })
        gsap.to(".complaint-step-number", { y: -4, duration: 1.6, stagger: 0.15, ease: "sine.inOut", yoyo: true, repeat: -1 })

        observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          gsap.fromTo(entry.target, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", overwrite: "auto" })
          observer?.unobserve(entry.target)
        }), { threshold: 0.15 })
        gsap.utils.toArray<HTMLElement>(".complaint-history-note, .complaint-response").forEach((element) => observer?.observe(element))

        gsap.utils.toArray<HTMLElement>(".complaint-step, .complaint-row").forEach((element) => {
          const enter = () => gsap.to(element, { y: -4, scale: 1.012, duration: 0.22, ease: "power2.out", overwrite: "auto" })
          const leave = () => gsap.to(element, { y: 0, scale: 1, duration: 0.32, ease: "power2.out", overwrite: "auto" })
          element.addEventListener("mouseenter", enter)
          element.addEventListener("mouseleave", leave)
          cleanup.push(() => { element.removeEventListener("mouseenter", enter); element.removeEventListener("mouseleave", leave) })
        })

        const sendButton = rootRef.current?.querySelector<HTMLElement>(".complaint-send-button")
        const sendIcon = rootRef.current?.querySelector<HTMLElement>(".complaint-send-icon")
        if (sendButton && sendIcon) {
          const enter = () => { gsap.to(sendButton, { y: -2, scale: 1.025, duration: 0.2, overwrite: "auto" }); gsap.to(sendIcon, { x: 3, y: -2, rotate: -8, duration: 0.2, overwrite: "auto" }) }
          const leave = () => { gsap.to(sendButton, { y: 0, scale: 1, duration: 0.3, overwrite: "auto" }); gsap.to(sendIcon, { x: 0, y: 0, rotate: 0, duration: 0.25, overwrite: "auto" }) }
          sendButton.addEventListener("mouseenter", enter); sendButton.addEventListener("mouseleave", leave)
          cleanup.push(() => { sendButton.removeEventListener("mouseenter", enter); sendButton.removeEventListener("mouseleave", leave) })
        }
      }, rootRef)
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      cleanup.forEach((dispose) => dispose())
      context?.revert()
    }
  }, [])

  return <main ref={rootRef} id="main-content" className="relative overflow-hidden bg-slate-50/70 px-3 py-10 sm:px-6 sm:py-16 lg:px-8">{children}</main>
}
