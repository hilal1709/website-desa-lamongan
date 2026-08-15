"use client"

import { useState } from "react"
import { ShieldAlert, AlertTriangle, CheckCircle2, Save, MapPin, Plus, Trash2, Megaphone } from "lucide-react"

export function AdminDisasterManager() {
  const [overrideStatus, setOverrideStatus] = useState<"auto" | "aman" | "waspada" | "bahaya">("auto")
  const [announcement, setAnnouncement] = useState("")
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-700">PANEL KONTROL ADMIN DESA</span>
        <h2 className="text-xl font-black text-slate-900 mt-1">Kelola Status Bencana & Peta Kedungrejo</h2>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Pengaturan manual jika terjadi cuaca ekstrem lokal atau luapan banjir kiriman sungai hulu.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Status Manual Override */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
          <label className="text-xs font-extrabold text-slate-900 block">
            1. Mode Status Keamanan Bencana (Override Manual)
          </label>

          <div className="grid gap-3 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => setOverrideStatus("auto")}
              className={`rounded-2xl p-3 text-left border transition ${
                overrideStatus === "auto"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">Otomatis (API)</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-[11px] opacity-80 mt-1">Ikuti ramalan BMKG/Open-Meteo</p>
            </button>

            <button
              type="button"
              onClick={() => setOverrideStatus("aman")}
              className={`rounded-2xl p-3 text-left border transition ${
                overrideStatus === "aman"
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">Paksa "AMAN"</span>
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <p className="text-[11px] opacity-80 mt-1">Kondisi lapangan kondusif</p>
            </button>

            <button
              type="button"
              onClick={() => setOverrideStatus("waspada")}
              className={`rounded-2xl p-3 text-left border transition ${
                overrideStatus === "waspada"
                  ? "border-amber-600 bg-amber-600 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">Paksa "WASPADA"</span>
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <p className="text-[11px] opacity-80 mt-1">Genangan lokal / Hujan deras</p>
            </button>

            <button
              type="button"
              onClick={() => setOverrideStatus("bahaya")}
              className={`rounded-2xl p-3 text-left border transition ${
                overrideStatus === "bahaya"
                  ? "border-rose-700 bg-rose-700 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">SIAGA BANJIR KIRIMAN</span>
                <ShieldAlert className="h-4 w-4 text-white" />
              </div>
              <p className="text-[11px] opacity-80 mt-1">Banjir kiriman hulu / Luapan</p>
            </button>
          </div>
        </div>

        {/* Emergency Announcement Form */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
          <label className="text-xs font-extrabold text-slate-900 block flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-emerald-700" />
            2. Pengumuman Darurat Bencana Desa (Tampil di Header Warga)
          </label>
          <textarea
            rows={3}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Misal: Dihimbau warga Dusun Gabang untuk mengamankan pompa air persawahan karena debit air sungai mulai naik..."
            className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 font-medium"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Pengaturan status bencana berhasil diperbarui!
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-semibold">* Perubahan langsung berefek ke tampilan warga.</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-800 px-6 py-3 text-xs font-black text-white shadow-md hover:bg-emerald-900 transition"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Pengaturan Admin</span>
          </button>
        </div>
      </form>
    </div>
  )
}
