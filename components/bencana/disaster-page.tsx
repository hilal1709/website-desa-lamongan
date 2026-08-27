"use client"

import { useCallback, useState } from "react"
import dynamic from "next/dynamic"
import { DeferredDisasterContent } from "@/components/bencana/deferred-disaster-content"
import { DisasterCommandCenter } from "@/components/bencana/disaster-command-center"
import { PageHero } from "@/components/ui/page-hero"
import { WeatherForecast } from "@/components/bencana/weather-forecast"
import { DisasterPageMotion } from "@/components/bencana/disaster-page-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CmsPageContent } from "@/lib/cms-pages"
import type { DisasterRiskLevel, DisasterWeatherUpdate } from "@/components/bencana/disaster-types"

const LoadingBlock = () => <div className="h-52 animate-pulse rounded-3xl border border-slate-200 bg-slate-100 sm:h-64" aria-label="Memuat konten" />
const DisasterMap = dynamic(() => import("@/components/bencana/disaster-map").then((module) => module.DisasterMap), { ssr: false, loading: LoadingBlock })
const FarmingClimatePredictor = dynamic(() => import("@/components/bencana/farming-climate-predictor").then((module) => module.FarmingClimatePredictor), { loading: LoadingBlock })
const EmergencyAssistance = dynamic(() => import("@/components/bencana/emergency-assistance").then((module) => module.EmergencyAssistance), { loading: LoadingBlock })

export function DisasterPage({ hero }: { hero: CmsPageContent }) {
  const [riskLevel, setRiskLevel] = useState<DisasterRiskLevel>("aman")
  const [weather, setWeather] = useState({ precipitationToday: 0, weatherCode: 0 })
  const handleWeatherUpdate = useCallback(({ precipitationToday, weatherCode }: DisasterWeatherUpdate) => setWeather({ precipitationToday, weatherCode }), [])

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imageAlt="Sawah dan permukiman Desa Kedungrejo saat cuaca mendung" imagePosition={hero.imagePosition} />

      <DisasterPageMotion>
        <main className="mx-auto max-w-7xl space-y-8 overflow-x-hidden px-4 py-8 sm:space-y-12 sm:px-6 sm:py-12 lg:px-8">
          <section data-disaster-reveal="hero"><DisasterCommandCenter /></section>

          <section data-disaster-reveal aria-label="Prakiraan cuaca realtime"><WeatherForecast onRiskChange={setRiskLevel} onWeatherUpdate={handleWeatherUpdate} /></section>
          <section data-disaster-reveal aria-label="Panduan iklim pertanian"><DeferredDisasterContent label="panduan iklim"><FarmingClimatePredictor precipitationSum={weather.precipitationToday} weatherCode={weather.weatherCode} riskLevel={riskLevel} /></DeferredDisasterContent></section>

          <section data-disaster-reveal="map" aria-labelledby="disaster-map-title">
            <Card className="disaster-map-card min-w-0 overflow-hidden rounded-3xl border-slate-200 shadow-lg shadow-slate-950/[0.04] sm:rounded-[32px]">
              <CardHeader className="min-w-0 border-b border-slate-100 bg-[linear-gradient(120deg,#f8fafc,white,#ecfdf5)] p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle id="disaster-map-title" className="text-xl font-black text-slate-900 sm:text-3xl">Peta Lokasi Bencana</CardTitle>
                    <CardDescription className="mt-1 text-sm font-medium leading-6">Pantau titik evakuasi, posko, dan zona rawan secara interaktif.</CardDescription>
                  </div>
                  <span className="hidden shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-800 sm:inline-flex">Peta interaktif</span>
                </div>
              </CardHeader>
              <CardContent className="min-w-0 p-3 sm:p-6"><DeferredDisasterContent label="peta interaktif"><DisasterMap riskLevel={riskLevel} /></DeferredDisasterContent></CardContent>
            </Card>
          </section>

          <section data-disaster-reveal aria-label="Bantuan dan layanan darurat"><DeferredDisasterContent label="layanan bantuan"><EmergencyAssistance content={hero.sections.find((section) => section.key === "emergency-assistance")} /></DeferredDisasterContent></section>
        </main>
      </DisasterPageMotion>
    </>
  )
}
