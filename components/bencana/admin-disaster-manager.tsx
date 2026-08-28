"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { AlertIcon, CheckIcon, LoadingIcon, SaveIcon } from "@/components/bencana/admin-disaster-icons"
import { AnnouncementSection, DisasterOverview, LocationsSection, StatusSection } from "@/components/bencana/admin-disaster-sections"
import { emptyLocation, locationsPerPage, type AdminDisasterData, type LocationDraft } from "@/components/bencana/admin-disaster-types"

async function readApiResponse<T>(response: Response): Promise<T> {
  const raw = await response.text()
  if (!raw) throw new Error(response.ok ? "Server tidak mengirimkan konfirmasi penyimpanan." : "Server gagal memproses pengaturan bencana.")
  try { return JSON.parse(raw) as T } catch { throw new Error("Respons server tidak dapat dibaca. Silakan coba simpan lagi.") }
}

export function AdminDisasterManager({ initialData }: { initialData: AdminDisasterData }) {
  const root = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState(initialData.setting.override)
  const [announcement, setAnnouncement] = useState(initialData.setting.announcement ?? "")
  const [locations, setLocations] = useState<LocationDraft[]>(initialData.locations)
  const [page, setPage] = useState(1)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ tone: "success" | "error"; message: string } | null>(null)

  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const context = gsap.context(() => {
      gsap.fromTo("[data-disaster-animate]", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.09, ease: "power3.out" })
      gsap.to("[data-disaster-pulse]", { scale: 1.08, opacity: 0.35, duration: 1.8, ease: "sine.inOut", repeat: -1, yoyo: true })
    }, root)
    return () => context.revert()
  }, [])

  useLayoutEffect(() => {
    if (!notification || !dialog.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.fromTo(dialog.current, { autoAlpha: 0, y: 18, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: "back.out(1.35)" })
  }, [notification])

  const updateLocation = (index: number, field: keyof LocationDraft, value: string | boolean) => setLocations((current) => current.map((location, position) => position === index ? { ...location, [field]: field === "latitude" || field === "longitude" ? Number(value) : value } : location))
  const addLocation = () => { setLocations((current) => [...current, emptyLocation()]); setPage(Math.ceil((locations.length + 1) / locationsPerPage)); requestAnimationFrame(() => gsap.fromTo("[data-location-card]:last-child", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35 })) }
  const removeLocation = (index: number) => setLocations((current) => current.filter((_, position) => position !== index))

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (locations.some((location) => !location.name.trim() || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude) || location.latitude < -90 || location.latitude > 90 || location.longitude < -180 || location.longitude > 180)) { setNotification({ tone: "error", message: "Lengkapi nama dan koordinat yang valid untuk setiap titik peta." }); return }
    setSaving(true)
    try {
      const response = await fetch("/api/bencana", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ override: status, announcement, locations }) })
      const data = await readApiResponse<{ message?: string; locations?: typeof initialData.locations }>(response)
      if (!response.ok) throw new Error(data.message ?? "Pengaturan bencana gagal disimpan.")
      setLocations(data.locations ?? []); setNotification({ tone: "success", message: "Pengaturan status, pengumuman, dan titik peta berhasil diperbarui." })
    } catch (cause) { setNotification({ tone: "error", message: cause instanceof Error ? cause.message : "Pengaturan bencana gagal disimpan." }) } finally { setSaving(false) }
  }

  return <div ref={root} className="space-y-5">
    <DisasterOverview activeLocations={locations.filter((location) => location.isActive).length} status={status} />
    <form onSubmit={save} className="space-y-5">
      <StatusSection value={status} onChange={setStatus} />
      <AnnouncementSection value={announcement} onChange={setAnnouncement} />
      <LocationsSection locations={locations} page={page} onPageChange={setPage} onAdd={addLocation} onUpdate={updateLocation} onRemove={removeLocation} />
      <div data-disaster-animate className="sticky bottom-2 z-10 flex justify-stretch rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-lg backdrop-blur sm:bottom-4 sm:justify-end sm:p-3"><Button type="submit" size="lg" disabled={saving} className="w-full sm:w-auto">{saving ? <LoadingIcon className="animate-spin" /> : <SaveIcon />}{saving ? "Menyimpan…" : "Simpan perubahan"}</Button></div>
    </form>
    <Dialog open={Boolean(notification)} onOpenChange={(open) => !open && setNotification(null)}><DialogContent ref={dialog} className="w-[calc(100%-2rem)] max-w-md rounded-3xl border border-slate-200 bg-white p-0"><div className={cn("p-5 sm:p-6", notification?.tone === "error" ? "bg-rose-50" : "bg-emerald-50")}><span className={cn("grid size-12 place-items-center rounded-2xl", notification?.tone === "error" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700")}>{notification?.tone === "error" ? <AlertIcon className="size-6" /> : <CheckIcon className="size-6" />}</span><DialogTitle className="mt-5 text-xl font-bold">{notification?.tone === "error" ? "Perubahan belum tersimpan" : "Perubahan tersimpan"}</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-slate-600">{notification?.message}</DialogDescription><div className="mt-6 flex justify-stretch sm:justify-end"><DialogClose asChild><Button type="button" className="w-full sm:w-auto">Mengerti</Button></DialogClose></div></div></DialogContent></Dialog>
  </div>
}
