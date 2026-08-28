"use client"

import { useEffect, useRef } from "react"

/** Reloads an open CMS page when another device changes shared data. */
export function AdminContentSync() {
  const refreshTimer = useRef<number | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    let cancelled = false
    let disconnect: (() => void) | undefined

    const reload = () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
      // Several CMS managers keep their own client state. A full reload makes
      // the newest shared database state visible in every manager, not only
      // in Server Components.
      refreshTimer.current = window.setTimeout(() => window.location.reload(), 300)
    }

    // Fallback for deployments that have not configured Pusher yet.
    const poll = !key || !cluster ? window.setInterval(reload, 30_000) : null
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible" && (!key || !cluster)) reload()
    }
    window.addEventListener("visibilitychange", refreshWhenVisible)

    if (key && cluster) {
      void import("pusher-js").then(({ default: Pusher }) => {
        if (cancelled) return
        const pusher = new Pusher(key, { cluster })
        const channel = pusher.subscribe("cms-public")
        channel.bind("content-updated", reload)
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
  }, [])

  return null
}
