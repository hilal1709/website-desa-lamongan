"use client"

import type { ReactNode } from "react"
import { BarChart3, Home, Printer, Stethoscope, Store, UserCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type DataView = "infografis" | "medis" | "umkm"

export function DataSelector({ active, onChange }: { active: DataView; onChange: (view: DataView) => void }) {
  const items = [
    { id: "infografis" as const, title: "Data & Infografis Desa", icon: BarChart3 },
    { id: "medis" as const, title: "Data Rekam Medis", icon: Stethoscope },
    { id: "umkm" as const, title: "Data UMKM", icon: Store },
  ]

  return <section data-infographic-motion className="mt-5 sm:mt-6" aria-labelledby="data-selector-title"><h2 id="data-selector-title" className="mb-3 text-sm font-bold text-slate-700">Pilih data yang ingin ditampilkan</h2><div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3">{items.map(({ id, title, icon: Icon }) => { const selected = active === id; return <Button key={id} type="button" variant={selected ? "default" : "outline"} onClick={() => onChange(id)} aria-pressed={selected} className="h-12 w-full justify-start rounded-2xl px-4 text-left sm:h-auto sm:py-3"><Icon className="h-5 w-5" /><span className="truncate">{title}</span></Button> })}</div></section>
}

export function SectionHeader({ title, subtitle, tag }: { title: string; subtitle?: string; tag?: string }) {
  return <header className="mb-5 border-b border-slate-200 pb-3">{tag && <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">{tag}</p>}<h2 className="text-xl font-black text-slate-900 sm:text-2xl">{title}</h2>{subtitle && <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>}</header>
}

export function ChartCard({ title, description, badge, children }: { title: string; description: string; badge?: string; children: ReactNode }) {
  return <article data-infographic-motion><Card className="min-w-0 rounded-3xl border-slate-200/90 shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-md"><CardHeader className="flex-col items-start justify-between gap-3 border-b border-slate-100 p-4 pb-4 sm:flex-row sm:p-5 sm:pb-4"><div><CardTitle className="text-lg text-slate-900">{title}</CardTitle><CardDescription className="mt-1 text-xs font-medium">{description}</CardDescription></div>{badge && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{badge}</span>}</CardHeader><CardContent className="mt-4 min-w-0 p-4 pt-0 sm:mt-5 sm:p-5 sm:pt-0">{children}</CardContent></Card></article>
}

export function DashboardSummary({ year, dusun, hamletCount }: { year: number | "all"; dusun: string; hamletCount: number }) {
  return <section data-infographic-motion aria-labelledby="dashboard-summary-title"><Card className="mt-6 flex flex-col gap-4 rounded-3xl border-emerald-200/80 p-4 shadow-sm sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><h2 id="dashboard-summary-title" className="text-xl font-black leading-tight text-slate-900 sm:text-3xl">{year === "all" ? "Statistik Seluruh Tahun" : `Statistik Tahun ${year}`}{dusun === "all" ? " Seluruh Dusun" : ` ${dusun}`}</h2><p className="mt-1 text-sm font-medium text-slate-500">Pemerintah Desa Kedungrejo, Kecamatan Modo, Kabupaten Lamongan.</p></div><div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center sm:min-w-[120px]"><p className="text-xs font-bold text-slate-500">Total Dusun</p><p className="text-lg font-black text-emerald-800">{hamletCount} Dusun</p></div></Card></section>
}

const numberFormatter = new Intl.NumberFormat("id-ID")

export function KpiGrid({ totals, malePercentage, femalePercentage }: { totals: { population: number; households: number; male: number; female: number }; malePercentage: string; femalePercentage: string }) {
  const cards = [
    { label: "Jumlah Penduduk", value: totals.population, detail: "Warga terdaftar di Desa Kedungrejo", icon: Users, unit: "Jiwa", tone: "emerald" },
    { label: "Kepala Keluarga", value: totals.households, detail: "Jumlah KK resmi tercatat", icon: Home, unit: "KK", tone: "blue" },
    { label: "Laki-Laki", value: totals.male, detail: "Penduduk berjenis kelamin laki-laki", icon: UserCheck, unit: "Jiwa", percentage: malePercentage, tone: "blue" },
    { label: "Perempuan", value: totals.female, detail: "Penduduk berjenis kelamin perempuan", icon: UserCheck, unit: "Jiwa", percentage: femalePercentage, tone: "emerald" },
  ]

  return <section data-infographic-motion className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4" aria-label="Ringkasan demografi">{cards.map(({ label, value, detail, icon: Icon, unit, percentage, tone }) => <article key={label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 sm:p-6"><div className="flex items-center justify-between">{percentage ? <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${tone === "blue" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>{percentage}%</span> : <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label === "Jumlah Penduduk" ? "Demografi" : "Keluarga"}</span>}<span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tone === "blue" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}><Icon className="h-5 w-5" /></span></div><p className="mt-4 text-3xl font-black text-slate-900">{numberFormatter.format(value)} <span className="text-base font-bold text-slate-500">{unit}</span></p><h3 className="mt-1 text-sm font-extrabold text-slate-700">{label}</h3><p className="mt-2 text-xs text-slate-500">{detail}</p></article>)}</section>
}

export function PrintButton({ onClick }: { onClick: () => void }) {
  return <Button onClick={onClick} variant="outline" className="h-12 w-full rounded-2xl border-slate-300 px-5 text-slate-800 shadow-sm hover:text-emerald-800 sm:w-auto"><Printer className="h-4 w-4 text-emerald-700" /><span>Cetak Ringkasan Data</span></Button>
}
