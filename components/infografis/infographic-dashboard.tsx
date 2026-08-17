"use client"

import { useMemo, useState } from "react"
import {
  Users,
  Home,
  UserCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Printer,
  BarChart3,
  Store
} from "lucide-react"

import { AgeChart } from "./AgeChart"
import { EconomicCards } from "./EconomicCards"
import { EducationChart } from "./EducationChart"
import { FilterBar } from "./FilterBar"
import { GenderChart } from "./GenderChart"
import { OccupationChart } from "./OccupationChart"
import { PopulationChart } from "./PopulationChart"
import { TrendChart } from "./TrendChart"
import { InfographicMotion } from "./infographic-motion"
import { EmptyState } from "./EmptyState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AgeGroupStat, EducationStat, InfographicStat, OccupationStat, PopulationTrend } from "@/types"

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

function SectionHeader({ title, subtitle, tag }: { title: string; subtitle?: string; tag?: string }) {
  return (
    <div className="mb-5 border-b border-slate-200 pb-3">
      {tag && <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">{tag}</p>}
      <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}
    </div>
  )
}

function CardContainer({ title, description, badge, children }: { title: string; description: string; badge?: string; children: React.ReactNode }) {
  return (
    <Card data-infographic-motion className="rounded-3xl border-slate-200/90 shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="flex-row items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
          <CardDescription className="mt-1 text-xs font-medium">{description}</CardDescription>
        </div>
        {badge && (
          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
            {badge}
          </span>
        )}
      </CardHeader>
      <CardContent className="mt-5">{children}</CardContent>
    </Card>
  )
}

type DataView = "infografis" | "umkm"

function DataSelector({ active, onChange }: { active: DataView; onChange: (view: DataView) => void }) {
  const items = [
    { id: "infografis" as const, title: "Infografis Desa", icon: BarChart3 },
    { id: "umkm" as const, title: "Data UMKM", icon: Store },
  ]

  return <section data-infographic-motion className="mt-6"><p className="mb-3 text-sm font-bold text-slate-700">Pilih data yang ingin ditampilkan</p><div className="grid gap-3 sm:grid-cols-3">{items.map(({ id, title, icon: Icon }) => { const selected = active === id; return <Button key={id} type="button" variant={selected ? "default" : "outline"} onClick={() => onChange(id)} aria-pressed={selected} className="h-auto justify-start rounded-2xl px-4 py-3 text-left"><Icon className="h-5 w-5" /><span>{title}</span></Button> })}</div></section>
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

  if (!records.length) return <InfographicMotion><DataSelector active={activeData} onChange={setActiveData} /><EmptyState /></InfographicMotion>

  if (activeData === "umkm") return <InfographicMotion><DataSelector active={activeData} onChange={setActiveData} /><section data-infographic-motion className="mt-6"><SectionHeader tag="Ekonomi Desa" title="Data UMKM dan sektor ekonomi" subtitle="Ringkasan data pekerjaan warga yang mendukung potensi ekonomi desa." /><EconomicCards values={economic} /><div className="mt-6"><CardContainer title="Sebaran Mata Pencaharian Warga" description="Komposisi pekerjaan utama warga desa."><OccupationChart data={occupationData} /></CardContainer></div></section></InfographicMotion>

  return (
    <InfographicMotion>
      <DataSelector active={activeData} onChange={setActiveData} />
      {/* FILTER BAR & ACTION PRINT */}
      <div data-infographic-motion className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <Button
          onClick={handlePrint}
          variant="outline"
          className="h-12 rounded-2xl border-slate-300 px-5 text-slate-800 shadow-sm hover:text-emerald-800"
        >
          <Printer className="h-4 w-4 text-emerald-700" />
          <span>Cetak Ringkasan Data</span>
        </Button>
      </div>

      {/* STATISTIK HEADER RINGKASAN */}
      <Card data-infographic-motion className="mt-8 flex flex-col gap-4 rounded-3xl border-emerald-200/80 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
            {year === "all" ? "Statistik Seluruh Tahun" : `Statistik Tahun ${year}`}
            {dusun === "all" ? " Seluruh Dusun" : ` ${dusun}`}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Pemerintah Desa Kedungrejo, Kecamatan Modo, Kabupaten Lamongan.
          </p>
        </div>

        <div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center min-w-[120px]">
            <p className="text-xs font-bold text-slate-500">Total Dusun</p>
            <p className="text-lg font-black text-emerald-800">{hamlets.length} Dusun</p>
          </div>
        </div>
      </Card>

      {/* KARTU KPI UTAMA */}
      <section data-infographic-motion className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Penduduk Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Demografi</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {numberFormatter.format(totals.population)} <span className="text-base font-bold text-slate-500">Jiwa</span>
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-700">Jumlah Penduduk</p>
          <p className="mt-2 text-xs text-slate-500">Warga terdaftar di Desa Kedungrejo</p>
        </div>

        {/* Total KK Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Keluarga</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
              <Home className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {numberFormatter.format(totals.households)} <span className="text-base font-bold text-slate-500">KK</span>
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-700">Kepala Keluarga</p>
          <p className="mt-2 text-xs text-slate-500">Jumlah KK resmi tercatat</p>
        </div>

        {/* Laki-Laki Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
              {malePercentage}%
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {numberFormatter.format(totals.male)} <span className="text-base font-bold text-slate-500">Jiwa</span>
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-700">Laki-Laki</p>
          <p className="mt-2 text-xs text-slate-500">Penduduk berjenis kelamin laki-laki</p>
        </div>

        {/* Perempuan Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
              {femalePercentage}%
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {numberFormatter.format(totals.female)} <span className="text-base font-bold text-slate-500">Jiwa</span>
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-700">Perempuan</p>
          <p className="mt-2 text-xs text-slate-500">Penduduk berjenis kelamin perempuan</p>
        </div>
      </section>

      {/* GRAFIK DUSUN & GENDER */}
      <div data-infographic-motion className="mt-8 grid gap-7 lg:grid-cols-[1.35fr_.85fr]">
        <CardContainer
          title="Jumlah Warga Tiap Dusun"
          description="Perbandingan total populasi warga di Dusun Topang, Karangpilang, Dopok Sambi, dan Gabang."
          badge="4 Wilayah Dusun"
        >
          <PopulationChart data={stats} />
        </CardContainer>

        <CardContainer
          title="Komposisi Jenis Kelamin"
          description="Grafik perbandingan Laki-laki dan Perempuan."
        >
          <GenderChart male={totals.male} female={totals.female} />
        </CardContainer>
      </div>

      {/* KELOMPOK USIA & TINGKAT PENDIDIKAN */}
      <div data-infographic-motion className="mt-8 grid gap-7 lg:grid-cols-2">
        <CardContainer
          title="Kelompok Usia Warga Ringkas"
          description="Pembagian warga berdasarkan kelompok umur (Balita, Usia Sekolah, Produktif, Lansia)."
        >
          <AgeChart data={ageData} />
        </CardContainer>

        <CardContainer
          title="Tingkat Pendidikan Warga"
          description="Tingkat sekolah / pendidikan terakhir warga Desa Kedungrejo."
        >
          <EducationChart data={educationData} />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {educationData.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                <p className="text-xs font-bold text-slate-500">{item.name}</p>
                <p className="mt-1 text-lg font-black text-slate-900">{numberFormatter.format(item.total)}</p>
              </div>
            ))}
          </div>
        </CardContainer>
      </div>

      {/* TREN PERUMBAHAN PENDIDIK PER TAHUN */}
      <div data-infographic-motion className="mt-8">
        <CardContainer
          title="Tren Pertumbuhan Penduduk Per Tahun"
          description="Catatan perkembangan dan kenaikan jumlah warga Desa Kedungrejo dari tahun ke tahun."
        >
          <TrendChart data={visibleTrends} />
        </CardContainer>
      </div>

    </InfographicMotion>
  )
}
