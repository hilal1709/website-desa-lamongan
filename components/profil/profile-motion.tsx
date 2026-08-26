"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

export function ProfileMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let observer: IntersectionObserver | undefined
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        const countUp = (element: HTMLElement) => { const value = element.dataset.profileCount ?? ""; const match = value.match(/^(\d[\d.]*)/); if (!match || element.dataset.counted) return; element.dataset.counted = "true"; const number = Number(match[1].replaceAll(".", "")); if (!Number.isFinite(number)) return; const suffix = value.slice(match[1].length); const counter = { value: 0 }; gsap.to(counter, { value: number, duration: 1.35, ease: "power2.out", onUpdate: () => { element.textContent = `${Math.round(counter.value).toLocaleString("id-ID")}${suffix}` } }) }
        observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (!entry.isIntersecting) return; const element = entry.target as HTMLElement; gsap.to(element, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.8, delay: Number(element.dataset.motionDelay ?? 0), ease: "power3.out", overwrite: "auto" }); element.querySelectorAll<HTMLElement>("[data-profile-count]").forEach(countUp); observer?.unobserve(element) }), { threshold: 0.08, rootMargin: "0px 0px -8%" })
        const reveal = (selector: string, from: Record<string, number> = {}) => gsap.utils.toArray<HTMLElement>(selector, root.current).forEach((element, index) => { gsap.set(element, { autoAlpha: 0, y: 30, ...from }); element.dataset.motionDelay = String(Math.min(index * 0.1, 0.4)); observer?.observe(element) })
        reveal(".profile-history-copy", { x: -24, y: 12 }); reveal(".profile-stat-card", { y: 24, scale: 0.94 }); reveal(".profile-history-visual", { x: 30, scale: 0.96 }); reveal(".profile-vision-card", { y: 36, scale: 0.985 }); reveal(".profile-mission-item", { x: 26, y: 0 }); reveal(".profile-structure-cta", { y: 28, scale: 0.98 }); reveal(".profile-map", { y: 34, scale: 0.99 })
        gsap.to(".profile-orbit", { rotate: 360, duration: 18, repeat: -1, ease: "none" })
      }, root)
    })
    return () => { cancelled = true; observer?.disconnect(); context?.revert() }
  }, [])
  return <div ref={root}>{children}</div>
}
