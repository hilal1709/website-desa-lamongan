"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function ServiceSubmissionMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanup: Array<() => void> = []
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        gsap.from(".submission-intro", { autoAlpha: 0, x: -24, duration: 0.65, ease: "power3.out" })
        gsap.from(".submission-form-card", { autoAlpha: 0, y: 32, scale: 0.985, duration: 0.75, delay: 0.08, ease: "power3.out" })
        gsap.from(".submission-field", { autoAlpha: 0, y: 16, duration: 0.45, stagger: 0.07, delay: 0.2, ease: "power2.out" })
        // File inputs are critical controls: animate position only, never hide them.
        gsap.set(".submission-upload", { autoAlpha: 1 })
        gsap.from(".submission-upload", { x: 18, duration: 0.45, stagger: 0.07, delay: 0.38, ease: "power2.out" })
        gsap.to(".submission-orb", { y: -13, x: 8, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut" })
        const submit = root.current?.querySelector<HTMLElement>(".submission-submit")
        if (submit) { const enter = () => gsap.to(submit, { scale: 1.025, y: -2, duration: 0.2, overwrite: "auto" }); const leave = () => gsap.to(submit, { scale: 1, y: 0, duration: 0.3, overwrite: "auto" }); submit.addEventListener("mouseenter", enter); submit.addEventListener("mouseleave", leave); cleanup.push(() => { submit.removeEventListener("mouseenter", enter); submit.removeEventListener("mouseleave", leave) }) }
      }, root)
    })
    return () => { cancelled = true; cleanup.forEach((dispose) => dispose()); context?.revert() }
  }, [])
  return <div ref={root} className="relative overflow-hidden">{children}</div>
}
