"use client"

import { useState } from "react"

import { InfographicMotion } from "./infographic-motion"
import { DataSelector, SectionHeader, type DataView } from "./infographic-dashboard-ui"
import { PopulationEventsDashboard } from "./population-events-dashboard"
import { ResidentDashboard } from "./resident-dashboard"
import { UmkmCatalog, UmkmVisualization } from "./umkm-data"
import { MedicalData } from "./medical-data"
import type { UmkmPublicData } from "@/types"
import type { PublicElderlyHealth } from "@/lib/public-elderly-health"

export function InfographicDashboard({ umkm, elderlyHealth, initialData = "infografis", initialUmkmSection = "visualisasi" }: { umkm: UmkmPublicData; elderlyHealth: PublicElderlyHealth; initialData?: DataView; initialUmkmSection?: "visualisasi" | "katalog" }) {
  const [activeData, setActiveData] = useState<DataView>(initialData)
  const [umkmSection, setUmkmSection] = useState<"visualisasi" | "katalog">(initialUmkmSection)

  if (activeData === "medis") return <InfographicMotion><DataSelector active={activeData} onChange={setActiveData} /><MedicalData data={elderlyHealth} /></InfographicMotion>

  if (activeData === "umkm") {
    return <InfographicMotion><DataSelector active={activeData} onChange={setActiveData} /><section data-infographic-motion className="mt-6" aria-label="Data UMKM"><SectionHeader tag="Ekonomi Desa" title="UMKM Desa Kedungrejo" subtitle="Jelajahi potensi usaha warga, produk lokal, dan profil UMKM desa." /><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setUmkmSection("visualisasi")} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${umkmSection === "visualisasi" ? "bg-emerald-700 text-white" : "border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"}`}>Visualisasi UMKM</button><button type="button" onClick={() => setUmkmSection("katalog")} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${umkmSection === "katalog" ? "bg-emerald-700 text-white" : "border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50"}`}>Katalog & Profil</button></div>{umkmSection === "visualisasi" ? <UmkmVisualization data={umkm} /> : <UmkmCatalog catalog={umkm.catalog} />}</section></InfographicMotion>
  }

  return <InfographicMotion><DataSelector active={activeData} onChange={setActiveData} /><ResidentDashboard /><PopulationEventsDashboard /></InfographicMotion>
}
