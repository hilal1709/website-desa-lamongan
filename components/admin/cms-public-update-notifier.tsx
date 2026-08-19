"use client"

import { useEffect } from "react"

/** Broadcast every successful CMS mutation to other public tabs in this browser. */
export function CmsPublicUpdateNotifier() {
  useEffect(() => {
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const response = await originalFetch(...args)
      const [input, init] = args
      const request = input instanceof Request ? input : undefined
      const method = (init?.method ?? request?.method ?? "GET").toUpperCase()
      const rawUrl = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url
      const pathname = new URL(rawUrl, window.location.origin).pathname

      if (response.ok && method !== "GET" && pathname.startsWith("/api/")) {
        window.localStorage.setItem("cms-public-updated", `${Date.now()}`)
      }
      return response
    }
    return () => { window.fetch = originalFetch }
  }, [])

  return null
}
