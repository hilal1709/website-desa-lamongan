"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

/** Silently refreshes server-rendered CMS data after a shared update. */
export function AdminContentSync() {
  const router = useRouter()
  const refreshTimer = useRef<number | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    let cancelled = false
    let disconnect: (() => void) | undefined

    const refresh = () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
      refreshTimer.current = window.setTimeout(() => router.refresh(), 300)
    }

    // Fallback for deployments that have not configured Pusher yet.
    const poll = !key || !cluster ? window.setInterval(refresh, 30_000) : null
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible" && (!key || !cluster)) refresh()
    }
    window.addEventListener("visibilitychange", refreshWhenVisible)

    if (key && cluster) {
      void import("pusher-js").then(({ default: Pusher }) => {
        if (cancelled) return
        const pusher = new Pusher(key, { cluster })
        const channel = pusher.subscribe("cms-public")
        channel.bind("content-updated", refresh)
        disconnect = () => {
          pusher.unsubscribe("cms-public")
          pusher.disconnect()
        }
      })
    }

    return () => {
      cancelled = true
      if (poll) window.clearInterval(poll)
      window.removeEventListener("visibilitychange", refreshWhenVisible)
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
      disconnect?.()
    }
  }, [router])

  return null
}
