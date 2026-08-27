"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { InfographicMotion } from "./infographic-motion"
import { DataSelector, SectionHeader, type DataView } from "./infographic-dashboard-ui"
import { PopulationEventsDashboard } from "./population-events-dashboard"
import type { UmkmPublicData } from "@/types"
import type { PublicElderlyHealth } from "@/lib/public-elderly-health"

const TabLoading = () => <div className="mt-6 grid min-h-64 place-items-center rounded-3xl border border-slate-200 bg-white text-sm font-medium text-slate-500">Menyiapkan visualisasi…</div>
const MedicalData = dynamic(() => import("./medical-data").then((module) => module.MedicalData), { loading: TabLoading })
const UmkmVisualization = dynamic(() => import("./umkm-data").then((module) => module.UmkmVisualization), { loading: TabLoading })
const UmkmCatalog = dynamic(() => import("./umkm-data").then((module) => module.UmkmCatalog), { loading: TabLoading })

export function InfographicDashboard({ umkm, elderlyHealth, initialData = "infografis", initialUmkmSection = "visualisasi" }: { umkm: UmkmPublicData; elderlyHealth: PublicElderlyHealth; initialData?: DataView; initialUmkmSection?: "visualisasi" | "katalog" }) {
  const [activeData, setActiveData] = useState<DataView>(initialData)
  const [umkmSection, setUmkmSection] = useState<"visualisasi" | "katalog">(initialUmkmSection)

  if (activeData === "medis") return <InfographicMotion motionKey={activeData}><DataSelector active={activeData} onChange={setActiveData} /><MedicalData data={elderlyHealth} /></InfographicMotion>

  if (activeData === "umkm") {
    return <InfographicMotion motionKey={`${activeData}-${umkmSection}`}><DataSelector active={activeData} onChange={setActiveData} /><section data-infographic-motion className="relative mt-6 overflow-hidden rounded-3xl border border-emerald-100/80 bg-white/60 p-4 sm:p-6" aria-labelledby="umkm-data-title"><span data-infographic-accent aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-emerald-200/45 blur-3xl" /><div className="relative"><SectionHeader tag="Ekonomi Desa" title="UMKM Desa Kedungrejo" subtitle="Jelajahi potensi usaha warga, produk lokal, dan profil UMKM desa." /><div className="flex flex-wrap gap-2" role="tablist" aria-label="Tampilan data UMKM"><Button type="button" onClick={() => setUmkmSection("visualisasi")} variant={umkmSection === "visualisasi" ? "default" : "outline"} aria-selected={umkmSection === "visualisasi"} role="tab">Visualisasi UMKM</Button><Button type="button" onClick={() => setUmkmSection("katalog")} variant={umkmSection === "katalog" ? "default" : "outline"} aria-selected={umkmSection === "katalog"} role="tab">Katalog & Profil</Button></div>{umkmSection === "visualisasi" ? <UmkmVisualization data={umkm} /> : <UmkmCatalog catalog={umkm.catalog} />}</div></section></InfographicMotion>
  }

  return <InfographicMotion motionKey={activeData}><DataSelector active={activeData} onChange={setActiveData} /><PopulationEventsDashboard /></InfographicMotion>
}
