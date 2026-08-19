"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export function PublicContentSync() {
  const router = useRouter()
  const refreshTimer = useRef<number | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    let cancelled = false
    let disconnect: (() => void) | undefined

    const refreshPublicContent = () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
      refreshTimer.current = window.setTimeout(() => router.refresh(), 300)
    }

    // Keep public content current even when a WebSocket is blocked by a browser,
    // network, or an incomplete Pusher deployment configuration.
    const poll = window.setInterval(refreshPublicContent, 30_000)
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refreshPublicContent()
    }
    window.addEventListener("visibilitychange", refreshWhenVisible)

    if (!key || !cluster) {
      return () => {
        window.clearInterval(poll)
        window.removeEventListener("visibilitychange", refreshWhenVisible)
        if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
      }
    }

    void import("pusher-js").then(({ default: Pusher }) => {
      if (cancelled) return
      const pusher = new Pusher(key, { cluster })
      const channel = pusher.subscribe("cms-public")
      channel.bind("content-updated", (data: { topic?: string }) => {
        window.dispatchEvent(new CustomEvent("cms-content-updated", { detail: data }))
        refreshPublicContent()
      })
      disconnect = () => {
        pusher.unsubscribe("cms-public")
        pusher.disconnect()
      }
    })

    return () => {
      cancelled = true
      window.clearInterval(poll)
      window.removeEventListener("visibilitychange", refreshWhenVisible)
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
      disconnect?.()
    }
  }, [router])

  return null
}
