"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export function PublicContentSync() {
  const router = useRouter()
  const refreshTimer = useRef<number | null>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    if (!key || !cluster) return

    let cancelled = false
    let disconnect: (() => void) | undefined

    void import("pusher-js").then(({ default: Pusher }) => {
      if (cancelled) return
      const pusher = new Pusher(key, { cluster })
      const channel = pusher.subscribe("cms-public")
      channel.bind("content-updated", () => {
        if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
        refreshTimer.current = window.setTimeout(() => router.refresh(), 800)
      })
      disconnect = () => {
        pusher.unsubscribe("cms-public")
        pusher.disconnect()
      }
    })

    return () => {
      cancelled = true
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
      disconnect?.()
    }
  }, [router])

  return null
}
