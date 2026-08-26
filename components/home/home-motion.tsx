"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let observer: IntersectionObserver | undefined
    let ctx: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanup: Array<() => void> = []
    const startAnimation = () => {
      void import("gsap").then(({ default: gsap }) => {
        if (!root.current || cancelled) return

        ctx = gsap.context(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            gsap.to(entry.target, {
              autoAlpha: 1,
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

      const reveal = (selector: string, options: gsap.TweenVars = {}) => {
        const elements = gsap.utils.toArray<HTMLElement>(selector, root.current)

        elements.forEach((element, index) => {
          gsap.set(element, {
            autoAlpha: 0,
            y: 28,
            ...options,
          })
          element.dataset.motionDelay = String(Math.min(index * 0.08, 0.4))
          observer?.observe(element)
        })
      }

      reveal(".home-stat", { y: 20, duration: 0.55, stagger: 0.08 })
      reveal(".home-section-heading", { y: 22 })
      reveal(".home-service-card", { y: 32, stagger: 0.12 })
      reveal(".home-digital-card", { y: 28, stagger: 0.12 })
      reveal(".home-overview-card", { y: 28, stagger: 0.08 })
      reveal(".home-news-card", { y: 28, stagger: 0.12 })
      reveal(".home-cta", { y: 24, scale: 0.98, duration: 0.65 })

      const interactiveCards = gsap.utils.toArray<HTMLElement>(".home-interactive-card", root.current)
      interactiveCards.forEach((card) => {
        const glow = card.querySelector<HTMLElement>(".home-card-glow")
        const enter = () => {
          gsap.to(card, { y: -7, scale: 1.012, duration: 0.28, ease: "power2.out", overwrite: "auto" })
          if (glow) gsap.to(glow, { autoAlpha: 1, scale: 1.15, duration: 0.35, overwrite: "auto" })
        }
        const leave = () => {
          gsap.to(card, { x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1, duration: 0.42, ease: "power3.out", overwrite: "auto" })
          if (glow) gsap.to(glow, { autoAlpha: 0.45, scale: 1, duration: 0.35, overwrite: "auto" })
        }
        const move = (event: MouseEvent) => {
          const bounds = card.getBoundingClientRect()
          gsap.to(card, { rotateY: ((event.clientX - bounds.left) / bounds.width - 0.5) * 5, rotateX: ((event.clientY - bounds.top) / bounds.height - 0.5) * -5, transformPerspective: 900, duration: 0.35, ease: "power2.out", overwrite: "auto" })
        }
        card.addEventListener("mouseenter", enter)
        card.addEventListener("mouseleave", leave)
        card.addEventListener("mousemove", move)
        cleanup.push(() => {
          card.removeEventListener("mouseenter", enter)
          card.removeEventListener("mouseleave", leave)
          card.removeEventListener("mousemove", move)
        })
      })
        }, root)
      })
    }

    // Hero motion is loaded separately. Defer below-the-fold GSAP work so it
    // cannot compete with the image and primary actions during first paint.
    const animationTimer = window.setTimeout(startAnimation, 150)

    return () => {
      cancelled = true
      window.clearTimeout(animationTimer)
      observer?.disconnect()
      cleanup.forEach((dispose) => dispose())
      ctx?.revert()
    }
  }, [])

  return <div ref={root}>{children}</div>
}
