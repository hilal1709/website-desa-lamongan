"use client"

import { useState } from "react"
import { PageHero } from "@/components/ui/page-hero"
import { DisasterMap } from "@/components/bencana/disaster-map"
import { WeatherForecast } from "@/components/bencana/weather-forecast"
import { FarmingClimatePredictor } from "@/components/bencana/farming-climate-predictor"
import { EmergencyAssistance } from "@/components/bencana/emergency-assistance"

export default function PetaBencanaPage() {
  const [riskLevel, setRiskLevel] = useState<"aman" | "waspada" | "bahaya">("aman")
  const [precipitationSum, setPrecipitationSum] = useState<number>(12.5)

  return (
    <>
      <PageHero
        eyebrow="INFORMASI DIGITAL DESA"
        title="Peta Bencana & Kalender Iklim Kedungrejo"
        description="Pantau prakiraan cuaca otomatis BMKG, panduan masa tanam/jemur gabah petani, peta titik evakuasi, serta akses bantuan bibit padi."
        image="/images/profil.jpeg"
        imagePosition="right"
      />

      <div className="mx-auto max-w-7xl px-5 py-12 space-y-12">
        {/* SECTION 1: WEATHER FORECAST & REALTIME RISK ALERT */}
        <section>
          <WeatherForecast onRiskChange={setRiskLevel} />
        </section>

        {/* SECTION 2: FARMER CLIMATE PREDICTOR & DAILY LIFE RECOMMENDATIONS */}
        <section>
          <FarmingClimatePredictor
            precipitationSum={precipitationSum}
            weatherCode={61}
            riskLevel={riskLevel}
          />
        </section>

        {/* SECTION 3: INTERACTIVE DISASTER MAP */}
        <section className="space-y-4">
          <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700">PETA WILAYAH INTERAKTIF</span>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Peta Titik Rawan & Posko Evakuasi</h2>
            <p className="text-sm font-medium text-slate-500">
              Peta interaktif wilayah Kedungrejo (Kecamatan Modo, Kab. Lamongan) untuk memantau posko evakuasi dan titik genangan air.
            </p>
          </div>

          <DisasterMap riskLevel={riskLevel} />
        </section>

        {/* SECTION 4: EMERGENCY FARMER ASSISTANCE & BOTTOM SERVICE CARDS GRID */}
        <section>
          <EmergencyAssistance riskLevel={riskLevel} />
        </section>
      </div>
    </>
  )
}
