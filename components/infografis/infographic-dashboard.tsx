"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { EconomicCards } from "./EconomicCards"
import { FilterBar } from "./FilterBar"
import { InfographicMotion } from "./infographic-motion"
import { EmptyState } from "./EmptyState"
import { ChartViewport } from "./chart-viewport"
import { ChartCard, DashboardSummary, DataSelector, KpiGrid, PrintButton, SectionHeader, type DataView } from "./infographic-dashboard-ui"
import type { AgeGroupStat, EducationStat, InfographicStat, OccupationStat, PopulationTrend } from "@/types"

const AgeChart = dynamic(() => import("./AgeChart").then((module) => module.AgeChart), { ssr: false })
const EducationChart = dynamic(() => import("./EducationChart").then((module) => module.EducationChart), { ssr: false })
const GenderChart = dynamic(() => import("./GenderChart").then((module) => module.GenderChart), { ssr: false })
const OccupationChart = dynamic(() => import("./OccupationChart").then((module) => module.OccupationChart), { ssr: false })
const PopulationChart = dynamic(() => import("./PopulationChart").then((module) => module.PopulationChart), { ssr: false })
const TrendChart = dynamic(() => import("./TrendChart").then((module) => module.TrendChart), { ssr: false })

type Props = {
  records: InfographicStat[]
  ages: AgeGroupStat[]
  education: EducationStat[]
  occupations: OccupationStat[]
  trends: PopulationTrend[]
}

const ageGroups = ["0-5", "6-17", "18-35", "36-59", "60+"]
const educationLevels = ["SD", "SMP", "SMA", "Perguruan Tinggi"]
const occupationNames = [
  "Petani",
  "UMKM/Wirausaha",
  "Karyawan Swasta",
  "PNS/ASN",
  "Guru/Tenaga Pendidikan",
  "Perangkat Desa",
  "Pelajar/Mahasiswa",
  "Belum/Tidak Bekerja"
]

const numberFormatter = new Intl.NumberFormat("id-ID")

function summarize<T extends { total: number }>(rows: T[], field: keyof T, labels: string[]) {
  return labels.map((name) => ({
    name,
    total: rows.filter((row) => String(row[field]) === name).reduce((sum, row) => sum + row.total, 0)
  }))
}

export function InfographicDashboard({
  records: rawRecords,
  ages: rawAges,
  education: rawEducation,
  occupations: rawOccupations,
  trends: rawTrends
}: Props) {
  const records = rawRecords
  const ages = rawAges
  const education = rawEducation
  const occupations = rawOccupations
  const trends = rawTrends

  const years = useMemo(() => [...new Set(records.map((item) => item.year))].sort((a, b) => b - a), [records])
  const hamlets = useMemo(() => [...new Set(records.map((item) => item.dusun))].sort((a, b) => a.localeCompare(b, "id")), [records])

  const [year, setYear] = useState<number | "all">(years[0] ?? "all")
  const [dusun, setDusun] = useState("all")
  const [activeData, setActiveData] = useState<DataView>("infografis")

  const match = <T extends { year: number; dusun: string }>(rows: T[]) =>
    rows.filter((row) => (year === "all" || row.year === year) && (dusun === "all" || row.dusun === dusun))

  const stats = match(records)
  const selectedAges = match(ages)
  const selectedEducation = match(education)
  const selectedOccupations = match(occupations)

  const totals = stats.reduce(
    (sum, row) => ({
      population: sum.population + row.total_population,
      households: sum.households + row.total_households,
      male: sum.male + row.male,
      female: sum.female + row.female
    }),
    { population: 0, households: 0, male: 0, female: 0 }
  )

  const ageData = summarize(selectedAges, "age_group", ageGroups)
  const educationData = summarize(selectedEducation, "education_level", educationLevels)
  const occupationData = summarize(selectedOccupations, "occupation", occupationNames)

  const occupationTotal = (name: string) => occupationData.find((item) => item.name === name)?.total ?? 0
  const economic = {
    umkm: occupationTotal("UMKM/Wirausaha"),
    farmers: occupationTotal("Petani"),
    formal: occupationTotal("Karyawan Swasta") + occupationTotal("PNS/ASN") + occupationTotal("Perangkat Desa"),
    educators: occupationTotal("Guru/Tenaga Pendidikan")
  }

  const visibleTrends = [...trends].sort((a, b) => a.year - b.year)

  const malePercentage = totals.population > 0 ? ((totals.male / totals.population) * 100).toFixed(1) : "0"
  const femalePercentage = totals.population > 0 ? ((totals.female / totals.population) * 100).toFixed(1) : "0"

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  if (activeData === "medis") return <InfographicMotion><DataSelector active={activeData} onChange={setActiveData} /><EmptyState title="Data rekam medis belum tersedia" description="Data akan tampil setelah sumber rekam medis terhubung ke sistem." /></InfographicMotion>

  if (!records.length) return <InfographicMotion><DataSelector active={activeData} onChange={setActiveData} /><EmptyState /></InfographicMotion>

  if (activeData === "umkm") return <InfographicMotion><DataSelector active={activeData} onChange={setActiveData} /><section data-infographic-motion className="mt-6" aria-label="Data UMKM dan sektor ekonomi"><SectionHeader tag="Ekonomi Desa" title="Data UMKM dan sektor ekonomi" subtitle="Ringkasan data pekerjaan warga yang mendukung potensi ekonomi desa." /><EconomicCards values={economic} /><div className="mt-6"><ChartCard title="Sebaran Mata Pencaharian Warga" description="Komposisi pekerjaan utama warga desa."><ChartViewport className="min-h-[38rem] sm:min-h-[22rem]"><OccupationChart data={occupationData} /></ChartViewport></ChartCard></div></section></InfographicMotion>

  return (
    <InfographicMotion>
      <DataSelector active={activeData} onChange={setActiveData} />
      {/* FILTER BAR & ACTION PRINT */}
      <div data-infographic-motion className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex-1">
          <FilterBar
            years={years}
            hamlets={hamlets}
            year={year}
            dusun={dusun}
            onYear={setYear}
            onDusun={setDusun}
          />
        </div>

        <PrintButton onClick={handlePrint} />
      </div>

      <DashboardSummary year={year} dusun={dusun} hamletCount={hamlets.length} />
      <KpiGrid totals={totals} malePercentage={malePercentage} femalePercentage={femalePercentage} />

      {/* GRAFIK DUSUN & GENDER */}
      <div data-infographic-motion className="mt-6 grid gap-5 sm:mt-8 sm:gap-7 lg:grid-cols-[1.35fr_.85fr]">
        <ChartCard
          title="Jumlah Warga Tiap Dusun"
          description="Perbandingan total populasi warga di Dusun Topang, Karangpilang, Dopok Sambi, dan Gabang."
          badge="4 Wilayah Dusun"
        >
          <ChartViewport><PopulationChart data={stats} /></ChartViewport>
        </ChartCard>

        <ChartCard
          title="Komposisi Jenis Kelamin"
          description="Grafik perbandingan Laki-laki dan Perempuan."
        >
          <ChartViewport><GenderChart male={totals.male} female={totals.female} /></ChartViewport>
        </ChartCard>
      </div>

      {/* KELOMPOK USIA & TINGKAT PENDIDIKAN */}
      <div data-infographic-motion className="mt-6 grid gap-5 sm:mt-8 sm:gap-7 lg:grid-cols-2">
        <ChartCard
          title="Kelompok Usia Warga Ringkas"
          description="Pembagian warga berdasarkan kelompok umur (Balita, Usia Sekolah, Produktif, Lansia)."
        >
          <ChartViewport className="min-h-64"><AgeChart data={ageData} /></ChartViewport>
        </ChartCard>

        <ChartCard
          title="Tingkat Pendidikan Warga"
          description="Tingkat sekolah / pendidikan terakhir warga Desa Kedungrejo."
        >
          <ChartViewport className="min-h-64"><EducationChart data={educationData} /></ChartViewport>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {educationData.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                <p className="text-xs font-bold text-slate-500">{item.name}</p>
                <p className="mt-1 text-lg font-black text-slate-900">{numberFormatter.format(item.total)}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* TREN PERUMBAHAN PENDIDIK PER TAHUN */}
      <div data-infographic-motion className="mt-6 sm:mt-8">
        <ChartCard
          title="Tren Pertumbuhan Penduduk Per Tahun"
          description="Catatan perkembangan dan kenaikan jumlah warga Desa Kedungrejo dari tahun ke tahun."
        >
          <ChartViewport><TrendChart data={visibleTrends} /></ChartViewport>
        </ChartCard>
      </div>

    </InfographicMotion>
  )
}
