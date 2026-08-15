"use client"

import { Sprout, Sun, CloudRain, ShieldCheck, AlertCircle, Info, Calendar, Sparkles, CheckCircle2, ChevronRight } from "lucide-react"

type ClimateProps = {
  precipitationSum: number
  weatherCode: number
  riskLevel: "aman" | "waspada" | "bahaya"
}

export function FarmingClimatePredictor({ precipitationSum, weatherCode, riskLevel }: ClimateProps) {
  // Determine farming & daily life recommendations based on rain precipitation
  const getFarmingStatus = () => {
    if (precipitationSum > 50) {
      return {
        planting: { label: "Waspada Luapan", status: "waspada", color: "bg-rose-50 text-rose-800 border-rose-200", icon: CloudRain, desc: "Curah hujan sangat tinggi (>50mm). Hindari tanam bibit muda yang rawan hanyut." },
        drying: { label: "Tidak Disarankan", status: "bahaya", color: "bg-rose-50 text-rose-800 border-rose-200", icon: CloudRain, desc: "Potensi hujan lebat. Amankan gabah & hasil panen ke dalam lumbung tertutup." },
        residential: { label: "Siaga Genangan", status: "bahaya", color: "bg-rose-100 text-rose-900 border-rose-300", icon: AlertCircle, desc: "Waspada genangan air di kawasan persawahan & alur sungai dusun." }
      }
    }
    if (precipitationSum > 15) {
      return {
        planting: { label: "Sangat Cocok Olah Tanah", status: "cocok", color: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: Sprout, desc: "Pasokan air memadai (15-50mm). Sangat baik untuk pembajakan sawah & olah lahan MT 1/2." },
        drying: { label: "Jemur Waspada", status: "waspada", color: "bg-amber-50 text-amber-800 border-amber-200", icon: Sun, desc: "Gunakan alas jemur cepat gulung. Potensi hujan ringan di siang/sore hari." },
        residential: { label: "Kondisi Waspada", status: "waspada", color: "bg-amber-50 text-amber-800 border-amber-200", icon: ShieldCheck, desc: "Pastikan saluran drainase depan rumah bersih dari sampah." }
      }
    }
    return {
      planting: { label: "Cukup Air / Perlu Irigasi", status: "normal", color: "bg-blue-50 text-blue-800 border-blue-200", icon: Sprout, desc: "Cuaca relatif cerah. Lakukan pengairan dari jaringan irigasi persawahan." },
      drying: { label: "Sangat Bagus Jemur", status: "bagus", color: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: Sun, desc: "Sinar matahari maksimal. Ideal untuk penjemuran gabah, jagung & palawija." },
      residential: { label: "Aman Terkendali", status: "aman", color: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: ShieldCheck, desc: "Cuaca cerah berawan. Aman untuk seluruh aktivitas warga desa." }
    }
  }

  const recommendations = getFarmingStatus()

  return (
    <div className="space-y-6">
      {/* Header Title Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Prediksi Iklim Otomatis Petani
          </span>
          <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
            Kalender Panduan Pertanian & Keamanan Desa
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 max-w-2xl">
            Sistem otomatis memetakan cuaca harian ke dalam rekomendasi aktivitas pertanian, penjemuran hasil panen, dan keselamatan warga Kedungrejo.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 rounded-2xl px-4 py-2 self-start sm:self-auto">
          📅 Periode: <b>Musim Tanam MT 1 & 2</b>
        </div>
      </div>

      {/* 3 Main Actionable Recommendation Cards (Elder Friendly) */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Card 1: Masa Tanam Padi */}
        <div className={`rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 ${recommendations.planting.color}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider opacity-75">FASE PERTANIAN</span>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
              <Sprout className="h-5 w-5" />
            </div>
          </div>

          <h3 className="mt-4 text-xl font-black">{recommendations.planting.label}</h3>
          <p className="mt-2 text-xs font-bold leading-relaxed opacity-90">{recommendations.planting.desc}</p>

          <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-extrabold">
            <span>Rekomendasi: Masa Tanam</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        {/* Card 2: Penjemuran Gabah & Hasil Panen */}
        <div className={`rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 ${recommendations.drying.color}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider opacity-75">PANEN & GABAH</span>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
              <Sun className="h-5 w-5" />
            </div>
          </div>

          <h3 className="mt-4 text-xl font-black">{recommendations.drying.label}</h3>
          <p className="mt-2 text-xs font-bold leading-relaxed opacity-90">{recommendations.drying.desc}</p>

          <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-extrabold">
            <span>Rekomendasi: Penjemuran</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        {/* Card 3: Keselamatan Pemukiman */}
        <div className={`rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 ${recommendations.residential.color}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider opacity-75">PEMUKIMAN DESA</span>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          <h3 className="mt-4 text-xl font-black">{recommendations.residential.label}</h3>
          <p className="mt-2 text-xs font-bold leading-relaxed opacity-90">{recommendations.residential.desc}</p>

          <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-extrabold">
            <span>Rekomendasi: Pemukiman</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Transparent Disclaimer Banner */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 font-medium flex items-start gap-3">
        <Info className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <b>Catatan Penting untuk Warga & Petani Kedungrejo:</b>
          <p className="mt-0.5 text-slate-500">
            Prediksi cuaca dan rekomendasi iklim di atas diperbarui secara otomatis setiap 6 jam berdasarkan sinyal stasiun meteorologi BMKG & Open-Meteo.
            Selalu kombinasikan dengan pengamatan cuaca fisik langsung di wilayah dusun Anda.
          </p>
        </div>
      </div>
    </div>
  )
}
