"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { AgeChart } from "./AgeChart"
import { EconomicCards } from "./EconomicCards"
import { EducationChart } from "./EducationChart"
import { EmptyState } from "./EmptyState"
import { FilterBar } from "./FilterBar"
import { GenderChart } from "./GenderChart"
import { KpiCards } from "./KpiCards"
import { OccupationChart } from "./OccupationChart"
import { PopulationChart } from "./PopulationChart"
import { TrendChart } from "./TrendChart"
import type { AgeGroupStat, EducationStat, InfographicStat, OccupationStat, PopulationTrend } from "@/types"

type Props = { records: InfographicStat[]; ages: AgeGroupStat[]; education: EducationStat[]; occupations: OccupationStat[]; trends: PopulationTrend[] }
const ageGroups = ["0-5", "6-17", "18-35", "36-59", "60+"]
const educationLevels = ["SD", "SMP", "SMA", "Perguruan Tinggi"]
const occupationNames = ["Petani", "UMKM/Wirausaha", "Karyawan Swasta", "PNS/ASN", "Guru/Tenaga Pendidikan", "Perangkat Desa", "Pelajar/Mahasiswa", "Belum/Tidak Bekerja"]
const number = new Intl.NumberFormat("id-ID")

function summarize<T extends { total: number }>(rows: T[], field: keyof T, labels: string[]) { return labels.map((name) => ({ name, total: rows.filter((row) => String(row[field]) === name).reduce((sum, row) => sum + row.total, 0) })) }
function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-7"><h2 className="text-xl font-bold text-slate-950">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p><div className="mt-5">{children}</div></section> }

export function InfographicDashboard({ records, ages, education, occupations, trends }: Props) {
  const years = useMemo(() => [...new Set(records.map((item) => item.year))].sort((a, b) => b - a), [records])
  const hamlets = useMemo(() => [...new Set(records.map((item) => item.dusun))].sort((a, b) => a.localeCompare(b, "id")), [records])
  const [year, setYear] = useState<number | "all">(years[0] ?? "all")
  const [dusun, setDusun] = useState("all")
  const match = <T extends { year: number; dusun: string }>(rows: T[]) => rows.filter((row) => (year === "all" || row.year === year) && (dusun === "all" || row.dusun === dusun))
  const stats = match(records)
  const selectedAges = match(ages)
  const selectedEducation = match(education)
  const selectedOccupations = match(occupations)
  const totals = stats.reduce((sum, row) => ({ population: sum.population + row.total_population, households: sum.households + row.total_households, male: sum.male + row.male, female: sum.female + row.female }), { population: 0, households: 0, male: 0, female: 0 })
  const ageData = summarize(selectedAges, "age_group", ageGroups)
  const educationData = summarize(selectedEducation, "education_level", educationLevels)
  const occupationData = summarize(selectedOccupations, "occupation", occupationNames)
  const occupationTotal = (name: string) => occupationData.find((item) => item.name === name)?.total ?? 0
  const economic = { umkm: occupationTotal("UMKM/Wirausaha"), farmers: occupationTotal("Petani"), formal: occupationTotal("Karyawan Swasta") + occupationTotal("PNS/ASN") + occupationTotal("Perangkat Desa"), educators: occupationTotal("Guru/Tenaga Pendidikan") }
  const visibleTrends = [...trends].sort((a, b) => a.year - b.year)

  return <><FilterBar years={years} hamlets={hamlets} year={year} dusun={dusun} onYear={setYear} onDusun={setDusun}/>{stats.length ? <><div className="mt-9 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[.15em] text-emerald-700">Statistik kependudukan</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{year === "all" ? "Seluruh tahun" : `Data tahun ${year}`}{dusun === "all" ? "" : ` — ${dusun}`}</h2></div><span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100">{stats.length} data · {number.format(totals.population)} penduduk</span></div><KpiCards {...totals}/><div className="mt-7 grid gap-7 lg:grid-cols-[1.35fr_.85fr]"><ChartCard title="Penduduk per dusun" description="Perbandingan jumlah penduduk sesuai filter."><PopulationChart data={stats}/></ChartCard><ChartCard title="Komposisi jenis kelamin" description="Distribusi laki-laki dan perempuan."><GenderChart male={totals.male} female={totals.female}/></ChartCard></div><div className="mt-7 grid gap-7 lg:grid-cols-2"><ChartCard title="Kelompok usia" description="Komposisi penduduk menurut rentang usia."><AgeChart data={ageData}/></ChartCard><ChartCard title="Pendidikan" description="Tingkat pendidikan penduduk."><EducationChart data={educationData}/><div className="grid grid-cols-2 gap-3">{educationData.map((item) => <div key={item.name} className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-500">{item.name}</p><p className="mt-1 text-xl font-bold">{number.format(item.total)}</p></div>)}</div></ChartCard></div><ChartCard title="Mata pencaharian" description="Komposisi pekerjaan dan lima pekerjaan dengan jumlah tertinggi."><OccupationChart data={occupationData}/></ChartCard><div className="mt-7"><div><p className="text-sm font-bold uppercase tracking-[.15em] text-emerald-700">Potensi ekonomi</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Sektor penggerak desa</h2></div><EconomicCards values={economic}/></div><div className="mt-7"><ChartCard title="Tren penduduk per tahun" description="Perubahan jumlah penduduk dari tahun ke tahun."><TrendChart data={visibleTrends}/></ChartCard></div><section className="mt-7 rounded-3xl bg-gradient-to-r from-green-800 to-emerald-700 p-7 text-white shadow-lg shadow-green-900/15 sm:flex sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-wider text-emerald-200">Layanan kesehatan desa</p><h2 className="mt-2 text-2xl font-bold">Lihat data rekam medis warga</h2><p className="mt-2 text-blue-100">Akses informasi kesehatan desa secara terpusat.</p></div><Link href="/stunting" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 sm:mt-0">Buka rekam medis <ArrowRight size={17}/></Link></section></> : <EmptyState/>}</>
}
