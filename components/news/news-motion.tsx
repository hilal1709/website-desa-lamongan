"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

export function NewsMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    const listeners: Array<() => void> = []
    let cancelled = false

    const startAnimation = () => void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      const rootElement = root.current

      context = gsap.context(() => {
        const quickParallax = gsap.quickTo(".news-hero-image img", "y", { duration: 0.65, ease: "power3.out" })

        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return

              gsap.to(entry.target, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.7,
                delay: Number((entry.target as HTMLElement).dataset.motionDelay ?? 0),
                ease: "power3.out",
              })
              observer?.unobserve(entry.target)
            })
          },
          { threshold: 0.08, rootMargin: "0px 0px -8%" },
        )

        const reveal = (selector: string, from: Record<string, number>) => {
          gsap.utils.toArray<HTMLElement>(selector, rootElement).forEach((element, index) => {
            gsap.set(element, { autoAlpha: 0, ...from })
            element.dataset.motionDelay = String(Math.min(index * 0.1, 0.5))
            observer?.observe(element)
          })
        }

        reveal(".news-featured", { y: 36, scale: 0.985 })
        reveal(".news-popular", { x: 24, y: 0, scale: 0.985 })
        reveal(".news-eyebrow", { x: -14 })
        reveal(".news-filter", { y: 18 })
        reveal(".news-section-divider", { y: 18 })
        reveal(".news-card", { y: 30, scale: 0.975 })
        reveal(".news-pagination", { y: 14 })
        reveal(".news-empty-state", { y: 24, scale: 0.98 })

        gsap.to(".news-orb", { x: 24, y: 16, scale: 1.12, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.utils.toArray<HTMLElement>(".news-popular-item", rootElement).forEach((item) => {
          const enter = () => gsap.to(item, { x: 5, duration: 0.22, ease: "power2.out" })
          const leave = () => gsap.to(item, { x: 0, duration: 0.22, ease: "power2.out" })
          item.addEventListener("mouseenter", enter)
          item.addEventListener("mouseleave", leave)
          listeners.push(() => { item.removeEventListener("mouseenter", enter); item.removeEventListener("mouseleave", leave) })
        })

        const image = rootElement.querySelector<HTMLElement>(".news-hero-image")
        if (image) {
          const onPointerMove = (event: PointerEvent) => {
            const bounds = image.getBoundingClientRect()
            quickParallax(((event.clientY - bounds.top) / bounds.height - 0.5) * -12)
          }
          const reset = () => quickParallax(0)
          image.addEventListener("pointermove", onPointerMove)
          image.addEventListener("pointerleave", reset)
          listeners.push(() => { image.removeEventListener("pointermove", onPointerMove); image.removeEventListener("pointerleave", reset) })
        }
      }, root)
    })

    const animationTimer = window.setTimeout(startAnimation, 250)

    return () => {
      cancelled = true
      window.clearTimeout(animationTimer)
      observer?.disconnect()
      listeners.forEach((remove) => remove())
      context?.revert()
    }
  }, [])

  return <div ref={root}>{children}</div>
}
