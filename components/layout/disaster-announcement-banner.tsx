"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Megaphone } from "lucide-react"

type DisasterSetting = { announcement?: string | null; override?: string }

const statusLabel = { auto: "Informasi kesiapsiagaan", aman: "Status aman", waspada: "Status waspada", bahaya: "Peringatan darurat" } as const

export function DisasterAnnouncementBanner({ initialSetting }: { initialSetting: DisasterSetting | null }) {
  const [setting, setSetting] = useState<DisasterSetting | null>(initialSetting)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const response = await fetch("/api/bencana", { cache: "no-store" })
        if (!response.ok) return
        const data = await response.json() as { setting?: DisasterSetting }
        if (active) setSetting(data.setting ?? null)
      } catch {
        // The public site remains usable when the announcement endpoint is unavailable.
      }
    }
    void load()
    const onContentUpdate = (event: Event) => {
      if ((event as CustomEvent<{ topic?: string }>).detail?.topic === "disaster") void load()
    }
    window.addEventListener("cms-content-updated", onContentUpdate)
    const refresh = window.setInterval(() => void load(), 60_000)
    return () => { active = false; window.removeEventListener("cms-content-updated", onContentUpdate); window.clearInterval(refresh) }
  }, [])

  const announcement = setting?.announcement?.trim()
  if (!announcement) return null

  const override = setting?.override === "aman" || setting?.override === "waspada" || setting?.override === "bahaya" ? setting.override : "auto"
  const emergency = override === "bahaya"
  const warning = override === "waspada"
  const tone = emergency ? "bg-rose-700 text-white" : warning ? "bg-amber-600 text-white" : "bg-emerald-700 text-white"
  const Icon = emergency || warning ? AlertTriangle : Megaphone

  return <aside role={emergency ? "alert" : "status"} aria-label="Pengumuman bencana desa" className={`relative z-40 overflow-hidden ${tone}`}>
    <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 sm:px-6"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/20"><Icon className="size-4" aria-hidden="true" /></span><p className="shrink-0 text-xs font-black uppercase tracking-[.12em]">{statusLabel[override]}</p><div className="min-w-0 flex-1 overflow-hidden" aria-live="polite"><p className="disaster-ticker inline-block whitespace-nowrap text-sm font-bold">{announcement}<span className="mx-12 opacity-70">•</span>{announcement}</p></div></div>
  </aside>
}
