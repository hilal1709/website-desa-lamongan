"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { CmsNoticeDialog } from "@/components/infografis/cms-notice-dialog"

export function AdminMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const [notice, setNotice] = useState<{ message: string; variant: "success" | "error" } | null>(null)

  useEffect(() => {
    const showNotice = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string; variant?: "success" | "error" }>).detail
      if (detail?.message) setNotice({ message: detail.message, variant: detail.variant === "error" ? "error" : "success" })
    }
    window.addEventListener("cms:notice", showNotice)
    return () => window.removeEventListener("cms:notice", showNotice)
  }, [])

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanups: (() => void)[] = []
    const timer = window.setTimeout(() => void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        const reveals = gsap.utils.toArray<HTMLElement>("[data-admin-reveal]", root.current)
        const cards = gsap.utils.toArray<HTMLElement>("[data-admin-card]", root.current)
        gsap.fromTo(reveals, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.08, ease: "power3.out" })
        gsap.to("[data-admin-orb]", { x: 22, y: 14, scale: 1.14, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to("[data-admin-orb-secondary]", { x: -16, y: -10, scale: 1.08, duration: 4.6, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to("[data-admin-progress]", { scaleX: 1, duration: 0.9, stagger: 0.1, ease: "power3.out", transformOrigin: "left center" })
        if (pathname === "/admin/umkm") {
          const umkmStats = gsap.utils.toArray<HTMLElement>("[aria-labelledby='kelola-katalog-umkm-title'] [data-admin-reveal]", root.current)
          const catalogControls = gsap.utils.toArray<HTMLElement>("#katalog-umkm button", root.current)
          gsap.fromTo(umkmStats, { autoAlpha: 0, y: 22, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.09, ease: "back.out(1.45)" })
          catalogControls.forEach((control) => {
            const enter = () => gsap.to(control, { y: -2, scale: 1.03, duration: 0.18, ease: "power2.out", overwrite: "auto" })
            const leave = () => gsap.to(control, { y: 0, scale: 1, duration: 0.24, ease: "power2.out", overwrite: "auto" })
            control.addEventListener("mouseenter", enter); control.addEventListener("mouseleave", leave)
            cleanups.push(() => { control.removeEventListener("mouseenter", enter); control.removeEventListener("mouseleave", leave) })
          })
        }
        cards.forEach((card) => {
          const icon = card.querySelector("[data-admin-card-icon]")
          const arrow = card.querySelector("[data-admin-card-arrow]")
          const enter = () => { gsap.to(card, { y: -5, scale: 1.008, duration: 0.22, overwrite: "auto" }); gsap.to(icon, { rotate: -8, scale: 1.08, duration: 0.22, overwrite: "auto" }); gsap.to(arrow, { x: 4, duration: 0.22, overwrite: "auto" }) }
          const leave = () => { gsap.to(card, { y: 0, scale: 1, duration: 0.3, overwrite: "auto" }); gsap.to(icon, { rotate: 0, scale: 1, duration: 0.28, overwrite: "auto" }); gsap.to(arrow, { x: 0, duration: 0.28, overwrite: "auto" }) }
          card.addEventListener("mouseenter", enter); card.addEventListener("mouseleave", leave)
          cleanups.push(() => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave) })
        })
        gsap.utils.toArray<HTMLElement>("[data-admin-action]", root.current).forEach((action) => {
          const enter = () => gsap.to(action, { y: -2, scale: 1.025, duration: 0.18, ease: "power2.out", overwrite: "auto" })
          const leave = () => gsap.to(action, { y: 0, scale: 1, duration: 0.24, ease: "power2.out", overwrite: "auto" })
          action.addEventListener("mouseenter", enter); action.addEventListener("mouseleave", leave)
          cleanups.push(() => { action.removeEventListener("mouseenter", enter); action.removeEventListener("mouseleave", leave) })
        })
      }, root)
    }), 80)
    return () => { cancelled = true; window.clearTimeout(timer); cleanups.forEach((cleanup) => cleanup()); context?.revert() }
  }, [pathname])

  return <div ref={root}>{children}<CmsNoticeDialog notice={notice} onClose={() => setNotice(null)} /></div>
}
