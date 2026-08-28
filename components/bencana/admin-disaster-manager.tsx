"use client"


import { BrowserlessSelect } from "@/components/ui/select"
import { LegacyDatePicker } from "@/components/ui/date-picker"
import { useState } from "react"
import { AlertTriangle, CheckCircle2, LoaderCircle, MapPin, Megaphone, Plus, Save, ShieldAlert, Trash2 } from "lucide-react"

type LocationType = "EVAKUASI" | "RAWAN" | "POSKO"
type DisasterLocation = { id: string; name: string; description: string | null; type: LocationType; latitude: number; longitude: number; isActive: boolean }
type LocationDraft = Omit<DisasterLocation, "id"> & { id?: string }

const emptyLocation = (): LocationDraft => ({ name: "", description: "", type: "POSKO", latitude: -7.1571, longitude: 112.1593, isActive: true })
const typeLabels: Record<LocationType, string> = { EVAKUASI: "Titik evakuasi", RAWAN: "Zona rawan", POSKO: "Posko" }
const inputClass = "mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"

async function readApiResponse<T>(response: Response): Promise<T> {
  const raw = await response.text()
  if (!raw) throw new Error(response.ok ? "Server tidak mengirimkan konfirmasi penyimpanan." : "Server gagal memproses pengaturan bencana.")
  try { return JSON.parse(raw) as T } catch { throw new Error("Respons server tidak dapat dibaca. Silakan coba simpan lagi.") }
}

export function AdminDisasterManager({ initialData }: { initialData: { setting: { override: "auto" | "aman" | "waspada" | "bahaya"; announcement: string | null }; locations: DisasterLocation[] } }) {
  const [overrideStatus, setOverrideStatus] = useState<"auto" | "aman" | "waspada" | "bahaya">(initialData.setting.override)
  const [announcement, setAnnouncement] = useState(initialData.setting.announcement ?? "")
  const [locations, setLocations] = useState<LocationDraft[]>(initialData.locations)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")


  const updateLocation = (index: number, field: keyof LocationDraft, value: string | boolean) => setLocations((current) => current.map((location, position) => position === index ? { ...location, [field]: field === "latitude" || field === "longitude" ? Number(value) : value } : location))

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage(""); setError("")
    if (locations.some((location) => !location.name.trim() || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude) || location.latitude < -90 || location.latitude > 90 || location.longitude < -180 || location.longitude > 180)) { setError("Lengkapi nama dan koordinat yang valid untuk setiap titik peta."); return }
    setSaving(true)
    try {
      const response = await fetch("/api/bencana", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ override: overrideStatus, announcement, locations }) })
      const data = await readApiResponse<{ message?: string; locations?: DisasterLocation[] }>(response)
      if (!response.ok) throw new Error(data.message ?? "Pengaturan bencana gagal disimpan.")
      setLocations(data.locations ?? []); setMessage("Pengaturan status, pengumuman, dan titik peta berhasil diperbarui.")
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Pengaturan bencana gagal disimpan.") } finally { setSaving(false) }
  }

  return <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
    <div className="border-b border-slate-100 pb-4"><span className="text-xs font-black uppercase tracking-wider text-emerald-700">Panel kontrol admin desa</span><h2 className="mt-1 text-xl font-black text-slate-900">Kelola status bencana & peta Kedungrejo</h2><p className="mt-1 text-xs font-medium text-slate-500">Atur peringatan lapangan, pengumuman warga, dan titik yang muncul pada peta publik.</p></div>
    {loading ? <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-600"><LoaderCircle className="size-4 animate-spin" />Memuat pengaturan bencana…</div> : <form onSubmit={handleSave} className="space-y-6">
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-5"><p className="text-xs font-extrabold text-slate-900">1. Mode status keamanan bencana</p><div className="grid gap-3 sm:grid-cols-4">{([ ["auto", "Otomatis (API)", "Ikuti ramalan cuaca", "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200", CheckCircle2], ["aman", "Paksa AMAN", "Kondisi lapangan kondusif", "border-emerald-600 bg-emerald-600 text-white", CheckCircle2], ["waspada", "Paksa WASPADA", "Genangan lokal / hujan deras", "border-amber-600 bg-amber-600 text-white", AlertTriangle], ["bahaya", "SIAGA BANJIR", "Luapan atau banjir kiriman", "border-rose-700 bg-rose-700 text-white", ShieldAlert] ] as const).map(([value, title, description, activeClass, Icon]) => <button key={value} type="button" onClick={() => setOverrideStatus(value)} className={`rounded-2xl border p-3 text-left transition ${overrideStatus === value ? activeClass : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"}`}><span className="flex items-center justify-between text-xs font-black">{title}<Icon className="size-4" /></span><span className="mt-1 block text-[11px] opacity-80">{description}</span></button>)}</div></section>
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-5"><label className="flex items-center gap-2 text-xs font-extrabold text-slate-900"><Megaphone className="size-4 text-emerald-700" />2. Pengumuman darurat untuk warga</label><textarea rows={3} value={announcement} onChange={(event) => setAnnouncement(event.target.value)} placeholder="Contoh: Warga diimbau mengamankan barang dan mengikuti arahan petugas." className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100" /></section>
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="flex items-center gap-2 text-xs font-extrabold text-slate-900"><MapPin className="size-4 text-emerald-700" />3. Titik pada peta publik</p><p className="mt-1 text-xs text-slate-500">Gunakan koordinat desimal, misalnya -7.1571 dan 112.1593.</p></div><button type="button" onClick={() => setLocations((current) => [...current, emptyLocation()])} className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"><Plus className="size-4" />Tambah titik</button></div>
        <div className="space-y-3">{locations.map((location, index) => <article key={location.id ?? `new-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-black text-slate-800">Titik {index + 1}</p><button type="button" onClick={() => setLocations((current) => current.filter((_, position) => position !== index))} className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900"><Trash2 className="size-4" />Hapus</button></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="text-xs font-bold text-slate-700">Nama<input value={location.name} onChange={(event) => updateLocation(index, "name", event.target.value)} required className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Jenis<BrowserlessSelect value={location.type} onChange={(event) => updateLocation(index, "type", event.target.value)} className={inputClass}>{(Object.keys(typeLabels) as LocationType[]).map((type) => <option key={type} value={type}>{typeLabels[type]}</option>)}</BrowserlessSelect></label><label className="text-xs font-bold text-slate-700">Latitude<input type="number" step="any" value={location.latitude} onChange={(event) => updateLocation(index, "latitude", event.target.value)} required className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Longitude<input type="number" step="any" value={location.longitude} onChange={(event) => updateLocation(index, "longitude", event.target.value)} required className={inputClass} /></label></div><label className="mt-3 block text-xs font-bold text-slate-700">Keterangan<textarea rows={2} value={location.description ?? ""} onChange={(event) => updateLocation(index, "description", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label><label className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-slate-700"><input type="checkbox" checked={location.isActive} onChange={(event) => updateLocation(index, "isActive", event.target.checked)} className="size-4 accent-emerald-700" />Tampilkan di peta publik</label></article>)}{!locations.length && <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">Belum ada titik peta. Tambahkan titik evakuasi, posko, atau zona rawan.</p>}</div></section>
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">{error}</p>}{message && <p role="status" className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800"><CheckCircle2 className="size-4" />{message}</p>}
      <div className="flex justify-end border-t border-slate-100 pt-4"><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-800 px-6 py-3 text-xs font-black text-white shadow-md transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}{saving ? "Menyimpan…" : "Simpan pengaturan"}</button></div>
    </form>}
  </div>
}


