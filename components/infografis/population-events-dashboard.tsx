"use client"


import { BrowserlessSelect } from "@/components/ui/select"
import { LegacyDatePicker } from "@/components/ui/date-picker"
import { useEffect, useMemo, useState } from "react"
import { Bar, Line } from "react-chartjs-2"
import { UsersRound } from "./infographic-icons"

import { Button } from "@/components/ui/button"
import { ResidentDashboard, type ResidentProfile } from "./resident-dashboard"

type EventType = "KELAHIRAN" | "KEMATIAN" | "PINDAH_MASUK" | "PINDAH_KELUAR"

type DashboardData = {
  summary: {
    counts: Record<EventType, number>
    naturalChange: number
    netMigration: number
    netChange: number
    totalPopulation: number
    populationByHamlet: { dusun: string; totalPopulation: number }[]
    demographics: { rows: { ageGroup: string; male: number; female: number }[]; male: number; female: number }
  }
  monthly: ({ month: number } & Record<EventType, number>)[]
  byHamlet: ({ dusun: string } & Record<EventType, number>)[]
  records: { id: string; eventDate: string; type: EventType; typeLabel: string; gender: string; birthYear: number; dusun: string }[]
  residentProfile: ResidentProfile
  pagination: { page: number; totalPages: number; totalRecords: number }
}

const eventTypes: { value: EventType; label: string; color: string }[] = [
  { value: "KELAHIRAN", label: "Kelahiran", color: "#059669" },
  { value: "KEMATIAN", label: "Kematian", color: "#dc2626" },
  { value: "PINDAH_MASUK", label: "Pindah masuk", color: "#2563eb" },
  { value: "PINDAH_KELUAR", label: "Pindah keluar", color: "#d97706" },
]

const hamlets = ["Dusun Dopok Sambi", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"]
const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
const formatter = new Intl.NumberFormat("id-ID")

export function PopulationEventsDashboard() {
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [month, setMonth] = useState("")
  const [dusun, setDusun] = useState("")
  const [type, setType] = useState("")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<DashboardData | null>(null)
  const [message, setMessage] = useState("")

  const query = useMemo(() => {
    const params = new URLSearchParams({ year, page: String(page), pageSize: "10" })
    if (month) params.set("month", month)
    if (dusun) params.set("dusun", dusun)
    if (type) params.set("type", type)
    return params
  }, [year, month, dusun, type, page])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    fetch(`/api/infografis/kependudukan?${query}`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error)
        if (active) {
          setData(body)
          setMessage("")
        }
      })
      .catch((error: unknown) => {
        if (active && (error as { name?: string }).name !== "AbortError") setMessage(error instanceof Error ? error.message : "Data belum dapat dimuat.")
      })
    return () => {
      active = false
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    const refreshPopulationData = (event: Event) => {
      const topic = (event as CustomEvent<{ topic?: string }>).detail?.topic
      if (topic === "population") {
        void fetch(`/api/infografis/kependudukan?${query}`, { signal: controller.signal })
          .then(async (response) => {
            const body = await response.json()
            if (active && response.ok) setData(body)
          })
          .catch((error: unknown) => {
            if (active && (error as { name?: string }).name !== "AbortError") console.error("Population data could not be refreshed", error)
          })
      }
    }
    window.addEventListener("cms-content-updated", refreshPopulationData)
    return () => {
      active = false
      controller.abort()
      window.removeEventListener("cms-content-updated", refreshPopulationData)
    }
  }, [query])

  const setFilter = (setValue: (value: string) => void) => (value: string) => {
    setValue(value)
    setPage(1)
  }
  const cards = data ? [
    { label: "Jumlah penduduk", value: data.summary.totalPopulation, tone: "text-emerald-800", unit: "jiwa" },
    { label: "Kelahiran", value: data.summary.counts.KELAHIRAN, tone: "text-emerald-700" },
    { label: "Kematian", value: data.summary.counts.KEMATIAN, tone: "text-red-700" },
    { label: "Perubahan penduduk", value: data.summary.netChange, tone: "text-slate-900" },
  ] : []

  return <section data-infographic-motion className="mt-8 border-t border-slate-200 pt-8 sm:mt-10 sm:pt-10" aria-labelledby="population-events-title">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Data peristiwa</p><h2 id="population-events-title" className="mt-1 text-2xl font-black text-slate-900">Dinamika Kependudukan</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Pantau kelahiran, kematian, serta perpindahan warga. Detail publik telah disamarkan dari identitas sensitif.</p></div>
    </div>

    <div className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-xs font-bold text-slate-700">Tahun<input type="number" min="2000" max="2100" value={year} onChange={(event) => setFilter(setYear)(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm" /></label>
      <label className="text-xs font-bold text-slate-700">Bulan<BrowserlessSelect value={month} onChange={(event) => setFilter(setMonth)(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Semua bulan</option>{months.map((item, index) => <option key={item} value={index + 1}>{item}</option>)}</BrowserlessSelect></label>
      <label className="text-xs font-bold text-slate-700">Dusun<BrowserlessSelect value={dusun} onChange={(event) => setFilter(setDusun)(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Semua dusun</option>{hamlets.map((item) => <option key={item} value={item}>{item}</option>)}</BrowserlessSelect></label>
      <label className="text-xs font-bold text-slate-700">Jenis peristiwa<BrowserlessSelect value={type} onChange={(event) => setFilter(setType)(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">Semua peristiwa</option>{eventTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</BrowserlessSelect></label>
    </div>

    {message ? <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{message}</p> : null}
    {!data ? <PopulationEventsLoading /> : null}
    {data ? <>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{cards.map((card) => <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-bold text-slate-500">{card.label}</p><p className={`mt-2 text-2xl font-black ${card.tone}`}>{card.value > 0 && !card.unit ? "+" : ""}{formatter.format(card.value)}{card.unit ? ` ${card.unit}` : ""}</p></article>)}</div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h3 className="font-black text-slate-900">Tren peristiwa per bulan</h3><div className="mt-5 h-72"><Line data={{ labels: months, datasets: eventTypes.map((item) => ({ label: item.label, data: data.monthly.map((row) => row[item.value]), borderColor: item.color, backgroundColor: item.color, tension: .35, pointRadius: 3 })) }} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }} /></div></article>
        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h3 className="font-black text-slate-900">Perbandingan per dusun</h3><div className="mt-5 h-72"><Bar data={{ labels: data.byHamlet.map((row) => row.dusun.replace("Dusun ", "")), datasets: eventTypes.map((item) => ({ label: item.label, data: data.byHamlet.map((row) => row[item.value]), backgroundColor: item.color, borderRadius: 8 })) }} options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } } } }} /></div></article>
      </div>
      <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="population-by-hamlet-title">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h3 id="population-by-hamlet-title" className="font-black text-slate-900">Jumlah penduduk per dusun</h3><p className="mt-1 text-sm text-slate-500">Jumlah jiwa resmi hingga akhir periode yang dipilih.</p></div><p className="text-sm font-bold text-emerald-800">Total: {formatter.format(data.summary.totalPopulation)} jiwa</p></div>
        <figure className="mt-5" aria-describedby="population-by-hamlet-caption">
          <div className="h-72 sm:h-80"><Bar data={{ labels: data.summary.populationByHamlet.map((row) => row.dusun.replace("Dusun ", "")), datasets: [{ label: "Jumlah penduduk", data: data.summary.populationByHamlet.map((row) => row.totalPopulation), backgroundColor: "#059669", borderRadius: 8, maxBarThickness: 64 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 0, minRotation: 0 } }, y: { beginAtZero: true, ticks: { callback: (value) => formatter.format(Number(value)) } } } }} /></div>
          <figcaption id="population-by-hamlet-caption" className="mt-3 text-sm leading-6 text-slate-500">Visual ini memakai data dasar penduduk dan perubahan kelahiran, kematian, serta perpindahan yang tercatat; bukan jumlah profil warga yang diinput.</figcaption>
        </figure>
        <div className="sr-only"><table><caption>Jumlah penduduk per dusun</caption><thead><tr><th>Dusun</th><th>Jumlah jiwa</th></tr></thead><tbody>{data.summary.populationByHamlet.map((row) => <tr key={row.dusun}><th>{row.dusun}</th><td>{formatter.format(row.totalPopulation)} jiwa</td></tr>)}</tbody></table></div>
      </article>
      <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="font-black text-slate-900">Piramida penduduk berdasarkan usia dan jenis kelamin</h3><p className="mt-1 text-sm text-slate-500">Laki-laki di sisi kiri, perempuan di sisi kanan. Komposisi awal diperbarui otomatis oleh catatan peristiwa.</p></div><div className="flex gap-4 text-sm font-bold"><span className="text-sky-700">Laki-laki: {formatter.format(data.summary.demographics.male)}</span><span className="text-fuchsia-700">Perempuan: {formatter.format(data.summary.demographics.female)}</span></div></div><div className="mt-5 h-96"><Bar data={{ labels: data.summary.demographics.rows.map((row) => row.ageGroup), datasets: [{ label: "Laki-laki", data: data.summary.demographics.rows.map((row) => -row.male), backgroundColor: "#0ea5e9", borderRadius: 6 }, { label: "Perempuan", data: data.summary.demographics.rows.map((row) => row.female), backgroundColor: "#d946ef", borderRadius: 6 }] }} options={{ indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { position: "bottom" }, tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${formatter.format(Math.abs(Number(context.parsed.x)))} jiwa` } } }, scales: { x: { stacked: true, ticks: { callback: (value) => formatter.format(Math.abs(Number(value))) } }, y: { stacked: true } } }} /></div></article>
      <ResidentDashboard profile={data.residentProfile} />
      <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><header className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><h3 className="font-black text-slate-900">Detail peristiwa agregat</h3><p className="mt-1 text-sm text-slate-500">{formatter.format(data.pagination.totalRecords)} catatan sesuai filter, tanpa identitas warga.</p></div><UsersRound className="text-emerald-700" /></header><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Tanggal", "Peristiwa", "Jenis kelamin", "Tahun lahir", "Dusun"].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 font-bold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{data.records.length ? data.records.map((record) => <tr key={record.id} className="text-slate-700"><td className="whitespace-nowrap px-4 py-3">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(`${record.eventDate}T00:00:00Z`))}</td><td className="whitespace-nowrap px-4 py-3 font-semibold">{record.typeLabel}</td><td className="whitespace-nowrap px-4 py-3">{record.gender}</td><td className="whitespace-nowrap px-4 py-3">{record.birthYear}</td><td className="whitespace-nowrap px-4 py-3">{record.dusun}</td></tr>) : <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">Belum ada peristiwa pada filter ini.</td></tr>}</tbody></table></div>{data.pagination.totalPages > 1 ? <footer className="flex items-center justify-between border-t border-slate-100 p-4"><Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Sebelumnya</Button><span className="text-sm font-medium text-slate-600">Halaman {data.pagination.page} dari {data.pagination.totalPages}</span><Button type="button" variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage((current) => current + 1)}>Berikutnya</Button></footer> : null}</article>
    </> : null}
  </section>
}

function PopulationEventsLoading() {
  return <section aria-busy="true" aria-live="polite" className="mt-5"><p className="sr-only" role="status">Memuat dinamika kependudukan</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <article key={index} data-infographic-motion className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className="block h-3 w-28 animate-pulse rounded-full bg-slate-200" /><span className="mt-3 block h-8 w-16 animate-pulse rounded-lg bg-emerald-100" /></article>)}</div><div className="mt-6 grid gap-5 lg:grid-cols-2">{Array.from({ length: 2 }).map((_, index) => <article key={index} data-infographic-motion className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><span className="block h-5 w-48 animate-pulse rounded-lg bg-slate-200" /><span className="mt-5 block h-72 animate-pulse rounded-2xl bg-slate-100" /></article>)}</div><article data-infographic-motion className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><span className="block h-5 w-72 max-w-full animate-pulse rounded-lg bg-slate-200" /><span className="mt-5 block h-96 animate-pulse rounded-2xl bg-slate-100" /></article></section>
}


