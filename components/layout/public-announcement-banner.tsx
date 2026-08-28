"use client"

import { useEffect, useState } from "react"
import { Megaphone } from "lucide-react"

export function PublicAnnouncementBanner({ initialAnnouncement }: { initialAnnouncement: string | null }) {
  const [announcement, setAnnouncement] = useState(initialAnnouncement)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const response = await fetch("/api/pengaturan", { cache: "no-store" })
        if (!response.ok) return
        const data = await response.json() as { publicAnnouncement?: string | null }
        if (active) setAnnouncement(data.publicAnnouncement ?? null)
      } catch {
        // Keep the latest known announcement visible if the request fails.
      }
    }
    void load()
    const onContentUpdate = (event: Event) => {
      if ((event as CustomEvent<{ topic?: string }>).detail?.topic === "settings") void load()
    }
    window.addEventListener("cms-content-updated", onContentUpdate)
    const refresh = window.setInterval(() => void load(), 60_000)
    return () => { active = false; window.removeEventListener("cms-content-updated", onContentUpdate); window.clearInterval(refresh) }
  }, [])

  const message = announcement?.trim()
  if (!message) return null
  return <aside role="status" aria-label="Pengumuman desa" className="relative z-40 border-b border-emerald-200 bg-emerald-50 text-emerald-950"><div className="mx-auto flex max-w-[1400px] items-center gap-2 px-5 py-3 text-sm font-semibold"><Megaphone className="size-4 shrink-0 text-emerald-700" aria-hidden="true" /><div className="min-w-0 flex-1 overflow-hidden" aria-live="polite"><p className="announcement-ticker">{message}</p></div></div></aside>
}
