"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"

export function ScrollToTop() {
  const pathname = usePathname()
  const animationRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
  }, [])

  useLayoutEffect(() => {
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" })

    resetScroll()
    requestAnimationFrame(resetScroll)
    const timer = window.setTimeout(resetScroll, 120)

    // Add a small delay to avoid hydration mismatch
    const animationTimer = window.setTimeout(() => {
      const main = document.querySelector("main")
      if (main && !animationRef.current?.isActive()) {
        animationRef.current = gsap.fromTo(
          main,
          { opacity: 0.96 },
          { opacity: 1, duration: 0.35, ease: "power2.out" },
        )
      }
    }, 50)

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(animationTimer)
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [pathname])

  return null
}
