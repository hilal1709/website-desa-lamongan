"use client"

import { useEffect, useLayoutEffect } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"

export function ScrollToTop() {
  const pathname = usePathname()

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

    gsap.fromTo(
      "main",
      { opacity: 0.96 },
      { opacity: 1, duration: 0.35, ease: "power2.out" },
    )

    return () => window.clearTimeout(timer)
  }, [pathname])

  return null
}
