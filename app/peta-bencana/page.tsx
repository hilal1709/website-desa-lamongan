"use client"

import { useState } from "react"
import { PageHero } from "@/components/ui/page-hero"
import { DisasterMap } from "@/components/bencana/disaster-map"
import { WeatherForecast } from "@/components/bencana/weather-forecast"
import { EmergencyAssistance } from "@/components/bencana/emergency-assistance"
import { ShieldCheck, MapPin, AlertCircle, Phone } from "lucide-react"

export default function PetaBencanaPage() {
  const [riskLevel, setRiskLevel] = useState<"aman" | "waspada" | "bahaya">("aman")

  return (
    <>
      <PageHero
        eyebrow="INFORMASI WESBITE DESA"
        title="Peta Lokasi Bencana & Cuaca Kedungrejo"
        description="Pantau prakiraan curah hujan real-time BMKG, peta titik rawan genangan, jalur evakuasi darurat, dan akses bantuan pertanian warga."
        image="/images/profil.jpeg"
        imagePosition="right"
      />

      <div className="mx-auto max-w-7xl px-5 py-12 space-y-12">
        {/* SECTION 1: WEATHER FORECAST & REALTIME RISK ALERT */}
        <section>
          <WeatherForecast onRiskChange={setRiskLevel} />
        </section>

        {/* SECTION 2: INTERACTIVE DISASTER MAP */}
        <section className="space-y-4">
          <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">PETA WILAYAH INTERAKTIF</span>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Peta Titik Rawan & Posko Evakuasi</h2>
            <p className="text-sm font-medium text-slate-500">
              Gunakan peta bawah untuk melihat lokasi shelter pengungsian, posko kesehatan, dan titik rawan genangan air di Kedungrejo.
            </p>
          </div>

          <DisasterMap riskLevel={riskLevel} />
        </section>

        {/* SECTION 3: EMERGENCY FARMER ASSISTANCE & BOTTOM SERVICE CARDS GRID */}
        <section>
          <EmergencyAssistance riskLevel={riskLevel} />
        </section>
      </div>
    </>
  )
}
