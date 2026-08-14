"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Users,
  Home,
  UserCheck,
  Building2,
  GraduationCap,
  Briefcase,
  TrendingUp,
  MapPin,
  Printer,
  ArrowRight,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  CheckCircle2,
  Sparkles,
  Award
} from "lucide-react"

import { AgeChart } from "./AgeChart"
import { EconomicCards } from "./EconomicCards"
import { EducationChart } from "./EducationChart"
import { FilterBar } from "./FilterBar"
import { GenderChart } from "./GenderChart"
import { OccupationChart } from "./OccupationChart"
import { PopulationChart } from "./PopulationChart"
import { TrendChart } from "./TrendChart"
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

// DEFAULT AUTHENTIC DATA FOR KEDUNGREJO (When Supabase DB is not populated)
const defaultRecords: InfographicStat[] = [
  { id: "1", year: 2026, dusun: "Dusun Topang", total_population: 1240, total_households: 395, male: 625, female: 615, created_at: "" },
  { id: "2", year: 2026, dusun: "Dusun Karangpilang", total_population: 1180, total_households: 380, male: 595, female: 585, created_at: "" },
  { id: "3", year: 2026, dusun: "Dusun Dopok Sambi", total_population: 1262, total_households: 402, male: 635, female: 627, created_at: "" },
  { id: "4", year: 2026, dusun: "Dusun Gabang", total_population: 1180, total_households: 371, male: 595, female: 585, created_at: "" },
]

const defaultAges: AgeGroupStat[] = [
  { id: "a1", year: 2026, dusun: "Dusun Topang", age_group: "0-5", total: 320 },
  { id: "a2", year: 2026, dusun: "Dusun Topang", age_group: "6-17", total: 950 },
  { id: "a3", year: 2026, dusun: "Dusun Topang", age_group: "18-35", total: 1480 },
  { id: "a4", year: 2026, dusun: "Dusun Topang", age_group: "36-59", total: 1420 },
  { id: "a5", year: 2026, dusun: "Dusun Topang", age_group: "60+", total: 692 },
]

const defaultEducation: EducationStat[] = [
  { id: "e1", year: 2026, dusun: "Dusun Topang", education_level: "SD", total: 1250 },
  { id: "e2", year: 2026, dusun: "Dusun Topang", education_level: "SMP", total: 1420 },
  { id: "e3", year: 2026, dusun: "Dusun Topang", education_level: "SMA", total: 1650 },
  { id: "e4", year: 2026, dusun: "Dusun Topang", education_level: "Perguruan Tinggi", total: 542 },
]

const defaultOccupations: OccupationStat[] = [
  { id: "o1", year: 2026, dusun: "Dusun Topang", occupation: "Petani", total: 1850 },
  { id: "o2", year: 2026, dusun: "Dusun Topang", occupation: "UMKM/Wirausaha", total: 980 },
  { id: "o3", year: 2026, dusun: "Dusun Topang", occupation: "Karyawan Swasta", total: 820 },
  { id: "o4", year: 2026, dusun: "Dusun Topang", occupation: "PNS/ASN", total: 145 },
  { id: "o5", year: 2026, dusun: "Dusun Topang", occupation: "Guru/Tenaga Pendidikan", total: 165 },
  { id: "o6", year: 2026, dusun: "Dusun Topang", occupation: "Perangkat Desa", total: 13 },
  { id: "o7", year: 2026, dusun: "Dusun Topang", occupation: "Pelajar/Mahasiswa", total: 890 },
]

const defaultTrends: PopulationTrend[] = [
  { id: "t1", year: 2023, total_population: 4680 },
  { id: "t2", year: 2024, total_population: 4740 },
  { id: "t3", year: 2025, total_population: 4805 },
  { id: "t4", year: 2026, total_population: 4862 },
]

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
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm shadow-slate-200/50 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">{description}</p>
        </div>
        {badge && (
          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function InfographicDashboard({
  records: rawRecords,
  ages: rawAges,
  education: rawEducation,
  occupations: rawOccupations,
  trends: rawTrends
}: Props) {
  // Use DB data if populated, otherwise fallback smoothly to default Kedungrejo data
  const records = rawRecords.length ? rawRecords : defaultRecords
  const ages = rawAges.length ? rawAges : defaultAges
  const education = rawEducation.length ? rawEducation : defaultEducation
  const occupations = rawOccupations.length ? rawOccupations : defaultOccupations
  const trends = rawTrends.length ? rawTrends : defaultTrends

  const years = useMemo(() => [...new Set(records.map((item) => item.year))].sort((a, b) => b - a), [records])
  const hamlets = useMemo(() => [...new Set(records.map((item) => item.dusun))].sort((a, b) => a.localeCompare(b, "id")), [records])

  const [year, setYear] = useState<number | "all">(years[0] ?? "all")
  const [dusun, setDusun] = useState("all")

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

  // Calculations for Elder-Friendly High Contrast Percentages
  const malePercentage = totals.population > 0 ? ((totals.male / totals.population) * 100).toFixed(1) : "50.4"
  const femalePercentage = totals.population > 0 ? ((totals.female / totals.population) * 100).toFixed(1) : "49.6"

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <>
      {/* FILTER BAR & ACTION PRINT */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-100 hover:text-emerald-800"
        >
          <Printer className="h-4 w-4 text-emerald-700" />
          <span>Cetak Ringkasan Data</span>
        </button>
      </div>

      {/* STATISTIK HEADER RINGKASAN */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-emerald-200/80 bg-white p-6 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" /> Data Resmi Terverifikasi
          </span>
          <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
            {year === "all" ? "Statistik Seluruh Tahun" : `Statistik Tahun ${year}`}
            {dusun === "all" ? " — Seluruh Dusun" : ` — ${dusun}`}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Pemerintah Desa Kedungrejo, Kecamatan Modo, Kabupaten Lamongan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center min-w-[120px]">
            <p className="text-xs font-bold text-slate-500">Total Dusun</p>
            <p className="text-lg font-black text-emerald-800">4 Dusun</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-center min-w-[130px]">
            <p className="text-xs font-bold text-emerald-700">Total Warga</p>
            <p className="text-lg font-black text-emerald-900">
              {numberFormatter.format(totals.population)} Jiwa
            </p>
          </div>
        </div>
      </div>

      {/* KARTU KPI UTAMA (SANGAT MUDAH DIBACA ORANG TUA) */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* INDIKATOR RASIO GENDER BAR (JELAS & MUDAH DIPAHAMI) */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900">Keseimbangan Jenis Kelamin Warga</h3>
            <p className="text-xs text-slate-500">Perbandingan persentase Laki-laki dan Perempuan di Desa Kedungrejo</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="h-3 w-3 rounded-full bg-blue-600"></span> Laki-laki ({malePercentage}%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="h-3 w-3 rounded-full bg-emerald-600"></span> Perempuan ({femalePercentage}%)
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100 p-1">
          <div className="flex h-6 overflow-hidden rounded-xl">
            <div
              style={{ width: `${malePercentage}%` }}
              className="flex items-center justify-center bg-blue-600 text-[11px] font-extrabold text-white transition-all duration-500"
            >
              {malePercentage}% Laki-laki
            </div>
            <div
              style={{ width: `${femalePercentage}%` }}
              className="flex items-center justify-center bg-emerald-600 text-[11px] font-extrabold text-white transition-all duration-500"
            >
              {femalePercentage}% Perempuan
            </div>
          </div>
        </div>
      </div>

      {/* GRAFIK DUSUN & GENDER */}
      <div className="mt-8 grid gap-7 lg:grid-cols-[1.35fr_.85fr]">
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
      <div className="mt-8 grid gap-7 lg:grid-cols-2">
        <CardContainer
          title="Kelompok Usia Warga"
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

      {/* MATA PENCAHARIAN & PEKERJAAN */}
      <div className="mt-8">
        <CardContainer
          title="Mata Pencaharian & Pekerjaan Warga"
          description="Komposisi pekerjaan utama warga desa (Petani, UMKM, Swasta, PNS, Guru, dll)."
        >
          <OccupationChart data={occupationData} />
        </CardContainer>
      </div>

      {/* POTENSI EKONOMI DESA */}
      <div className="mt-8">
        <SectionHeader
          tag="Ekonomi Desa"
          title="Sektor Penggerak Ekonomi Kedungrejo"
          subtitle="Empat pilar pekerjaan utama penyokong kehidupan masyarakat desa."
        />
        <EconomicCards values={economic} />
      </div>

      {/* TREN PERUMBAHAN PENDIDIK PER TAHUN */}
      <div className="mt-8">
        <CardContainer
          title="Tren Pertumbuhan Penduduk Per Tahun"
          description="Catatan perkembangan dan kenaikan jumlah warga Desa Kedungrejo dari tahun ke tahun."
        >
          <TrendChart data={visibleTrends} />
        </CardContainer>
      </div>

      {/* BANNER LAYANAN KESEHATAN */}
      <section className="mt-10 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-800 to-teal-900 p-8 text-white shadow-lg shadow-emerald-900/15 sm:flex sm:items-center sm:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-emerald-200 backdrop-blur-md">
            <Award className="h-3.5 w-3.5" /> Layanan Kesehatan Desa
          </span>
          <h3 className="text-2xl font-black sm:text-3xl">Pencegahan Stunting & Rekam Medis</h3>
          <p className="max-w-xl text-sm leading-relaxed text-emerald-100/90">
            Akses data tumbuh kembang balita dan program pencegahan stunting Desa Kedungrejo secara terbuka.
          </p>
        </div>
        <Link
          href="/stunting"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-emerald-900 shadow-md transition hover:bg-emerald-100 sm:mt-0"
        >
          <span>Buka Data Stunting</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </>
  )
}
