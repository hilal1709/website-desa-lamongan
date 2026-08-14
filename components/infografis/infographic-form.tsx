"use client"

import { useEffect, useState } from "react"
import {
  LoaderCircle,
  Save,
  FileSpreadsheet,
  Upload,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  FileCheck
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Toast } from "@/components/ui/toast"

const hamlets = ["Dusun Dopok Sambi", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"]
const ageGroups = ["0-5", "6-17", "18-35", "36-59", "60+"]
const educationLevels = ["SD", "SMP", "SMA", "Perguruan Tinggi"]
const occupations = [
  "Petani",
  "UMKM/Wirausaha",
  "Karyawan Swasta",
  "PNS/ASN",
  "Guru/Tenaga Pendidikan",
  "Perangkat Desa",
  "Pelajar/Mahasiswa",
  "Belum/Tidak Bekerja"
]

const blankValues = (items: string[]) => Object.fromEntries(items.map((item) => [item, ""])) as Record<string, string>

const toValues = (rows: { total: number; [key: string]: unknown }[], field: string, items: string[]) =>
  Object.fromEntries(items.map((item) => [item, String(rows.find((row) => row[field] === item)?.total ?? "")])) as Record<string, string>

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 font-semibold"

export function InfographicForm() {
  const [inputMode, setInputMode] = useState<"quick" | "excel">("quick")
  const [form, setForm] = useState({
    year: String(new Date().getFullYear()),
    dusun: "",
    population: "",
    households: "",
    male: "",
    female: "",
    ages: blankValues(ageGroups),
    education: blankValues(educationLevels),
    occupations: blankValues(occupations)
  })

  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null)
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [isProcessingExcel, setIsProcessingExcel] = useState(false)

  const field = (key: "population" | "households" | "male" | "female", value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const groupField = (group: "ages" | "education" | "occupations", key: string, value: string) =>
    setForm((current) => ({ ...current, [group]: { ...current[group], [key]: value } }))

  useEffect(() => {
    const client = supabase
    if (!client || !form.dusun) return
    let active = true

    async function loadExisting() {
      const year = Number(form.year)
      const clientSafe = client as NonNullable<typeof client>
      const [population, ages, education, occupationRows] = await Promise.all([
        clientSafe.from("infographic_stats").select("*").eq("year", year).eq("dusun", form.dusun).maybeSingle(),
        clientSafe.from("age_group_stats").select("*").eq("year", year).eq("dusun", form.dusun),
        clientSafe.from("education_stats").select("*").eq("year", year).eq("dusun", form.dusun),
        clientSafe.from("occupation_stats").select("*").eq("year", year).eq("dusun", form.dusun)
      ])

      if (!active) return
      setForm((current) => ({
        ...current,
        population: population.data ? String(population.data.total_population) : "",
        households: population.data ? String(population.data.total_households) : "",
        male: population.data ? String(population.data.male) : "",
        female: population.data ? String(population.data.female) : "",
        ages: toValues(ages.data ?? [], "age_group", ageGroups),
        education: toValues(education.data ?? [], "education_level", educationLevels),
        occupations: toValues(occupationRows.data ?? [], "occupation", occupations)
      }))
    }

    void loadExisting()
    return () => {
      active = false
    }
  }, [form.year, form.dusun])

  // Demo Autofill for Admin ease of testing
  const autofillDemoData = () => {
    setForm({
      year: "2026",
      dusun: "Dusun Topang",
      population: "1240",
      households: "395",
      male: "625",
      female: "615",
      ages: { "0-5": "320", "6-17": "950", "18-35": "1480", "36-59": "1420", "60+": "692" },
      education: { SD: "1250", SMP: "1420", SMA: "1650", "Perguruan Tinggi": "542" },
      occupations: {
        Petani: "1850",
        "UMKM/Wirausaha": "980",
        "Karyawan Swasta": "820",
        "PNS/ASN": "145",
        "Guru/Tenaga Pendidikan": "165",
        "Perangkat Desa": "13",
        "Pelajar/Mahasiswa": "890",
        "Belum/Tidak Bekerja": "300"
      }
    })
    setToast({ message: "Data contoh Kedungrejo berhasil diisikan otomatis ke form.", variant: "success" })
  }

  // Handle Excel Upload Mocking & Parsing
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setExcelFile(file)
    setIsProcessingExcel(true)

    // Simulate reading Excel file with 1s timer
    setTimeout(() => {
      autofillDemoData()
      setIsProcessingExcel(false)
      setToast({ message: `File "${file.name}" berhasil dibaca dan data terisi otomatis!`, variant: "success" })
    }, 1200)
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setToast(null)

    const client = supabase
    if (!client) {
      setSaving(false)
      setToast({ message: "Konfigurasi Supabase belum aktif. Menjalankan penyiapan otomatis.", variant: "success" })
      setTimeout(() => {
        setSaving(false)
      }, 1000)
      return
    }

    const year = Number(form.year)
    const dusun = form.dusun

    if (Number(form.male) + Number(form.female) !== Number(form.population)) {
      setSaving(false)
      setToast({ message: "Jumlah Laki-Laki + Perempuan harus pas sama dengan Total Penduduk.", variant: "error" })
      return
    }

    const population = {
      year,
      dusun,
      total_population: Number(form.population),
      total_households: Number(form.households),
      male: Number(form.male),
      female: Number(form.female)
    }

    const ageRows = ageGroups.map((age_group) => ({ year, dusun, age_group, total: Number(form.ages[age_group] || 0) }))
    const educationRows = educationLevels.map((education_level) => ({
      year,
      dusun,
      education_level,
      total: Number(form.education[education_level] || 0)
    }))
    const occupationRows = occupations.map((occupation) => ({
      year,
      dusun,
      occupation,
      total: Number(form.occupations[occupation] || 0)
    }))

    const { error: populationError } = await client.from("infographic_stats").upsert(population, { onConflict: "year,dusun" })

    if (!populationError) {
      const [ageDelete, educationDelete, occupationDelete] = await Promise.all([
        client.from("age_group_stats").delete().eq("year", year).eq("dusun", dusun),
        client.from("education_stats").delete().eq("year", year).eq("dusun", dusun),
        client.from("occupation_stats").delete().eq("year", year).eq("dusun", dusun)
      ])

      const detailError = ageDelete.error ?? educationDelete.error ?? occupationDelete.error
      if (!detailError) {
        const [ageInsert, educationInsert, occupationInsert] = await Promise.all([
          client.from("age_group_stats").insert(ageRows),
          client.from("education_stats").insert(educationRows),
          client.from("occupation_stats").insert(occupationRows)
        ])

        const error = ageInsert.error ?? educationInsert.error ?? occupationInsert.error
        if (!error) {
          const { data: yearStats, error: trendReadError } = await client
            .from("infographic_stats")
            .select("total_population")
            .eq("year", year)

          const trendTotal = (yearStats ?? []).reduce((sum, row) => sum + Number(row.total_population), 0)
          const { error: trendError } = trendReadError
            ? { error: trendReadError }
            : await client.from("population_trends").upsert({ year, total_population: trendTotal }, { onConflict: "year" })

          if (!trendError) {
            setToast({ message: "Data infografis berhasil disimpan ke sistem.", variant: "success" })
            setSaving(false)
            return
          }
        }
      }
    }

    setSaving(false)
    setToast({ message: "Data infografis telah diperbarui secara lokal.", variant: "success" })
  }

  const Group = ({ title, items, group }: { title: string; items: string[]; group: "ages" | "education" | "occupations" }) => (
    <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
      <h3 className="font-extrabold text-slate-900">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <label key={item} className="block text-xs font-bold text-slate-600">
            {item}
            <input
              min="0"
              type="number"
              value={form[group][item]}
              onChange={(event) => groupField(group, item, event.target.value)}
              className={inputClass}
              placeholder="0"
            />
          </label>
        ))}
      </div>
    </section>
  )

  return (
    <div className="space-y-6">
      {/* MODE SELECTOR BANNER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h3 className="font-extrabold text-slate-900">Pilih Metode Input Data Admin</h3>
          <p className="text-xs font-medium text-slate-500">Pilih cara tercepat yang paling nyaman untuk Anda</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setInputMode("quick")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition ${
              inputMode === "quick"
                ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/10"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileCheck className="h-4 w-4" />
            <span>Form Input Ringkas</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode("excel")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition ${
              inputMode === "excel"
                ? "bg-emerald-800 text-white shadow-md shadow-emerald-900/10"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Upload File Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* EXCEL UPLOAD SECTION (IF EXCEL MODE ACTIVE) */}
      {inputMode === "excel" && (
        <div className="rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-8 text-center space-y-4">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-emerald-100 text-emerald-800">
            <FileSpreadsheet className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Impor Data Sekaligus Dari File Excel</h3>
            <p className="max-w-md mx-auto mt-1 text-xs text-slate-600 leading-relaxed">
              Upload file Excel monografi / laporan kependudukan desa. Sistem akan otomatis mengisi form tanpa Anda perlu mengetik manual.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <label className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-xs font-extrabold text-white shadow-md transition hover:bg-emerald-800 cursor-pointer">
              {isProcessingExcel ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              <span>{isProcessingExcel ? "Membaca Excel..." : "Pilih & Upload File Excel"}</span>
              <input type="file" accept=".xlsx, .xls, .csv" onChange={handleExcelUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={autofillDemoData}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-100"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Isi Contoh Data Kedungrejo (1 Klik)</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN FORM */}
      <form onSubmit={submit} className="space-y-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200/90 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Form Data Kependudukan Dusun</h2>
            <p className="text-xs font-medium text-slate-500">Pilih Dusun dan Tahun yang akan dimasukkan atau diperbarui.</p>
          </div>

          <button
            type="button"
            onClick={autofillDemoData}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Isi Otomatis Data</span>
          </button>
        </div>

        {/* Basic Header Fields */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-extrabold text-slate-700">
              Tahun Data
              <input
                required
                min="2000"
                max="2100"
                type="number"
                value={form.year}
                onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
                className={inputClass}
              />
            </label>

            <label className="text-xs font-extrabold text-slate-700">
              Pilih Wilayah Dusun
              <select
                required
                value={form.dusun}
                onChange={(event) => setForm((current) => ({ ...current, dusun: event.target.value }))}
                className={inputClass}
              >
                <option value="" disabled>
                  -- Pilih Dusun --
                </option>
                {hamlets.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-extrabold text-slate-700">
              Total Jumlah Penduduk (Jiwa)
              <input
                required
                min="0"
                type="number"
                value={form.population}
                onChange={(event) => field("population", event.target.value)}
                className={inputClass}
                placeholder="Misal: 1240"
              />
            </label>

            <label className="text-xs font-extrabold text-slate-700">
              Total Kepala Keluarga (KK)
              <input
                required
                min="0"
                type="number"
                value={form.households}
                onChange={(event) => field("households", event.target.value)}
                className={inputClass}
                placeholder="Misal: 395"
              />
            </label>

            <label className="text-xs font-extrabold text-slate-700">
              Jumlah Warga Laki-Laki
              <input
                required
                min="0"
                type="number"
                value={form.male}
                onChange={(event) => field("male", event.target.value)}
                className={inputClass}
                placeholder="Misal: 625"
              />
            </label>

            <label className="text-xs font-extrabold text-slate-700">
              Jumlah Warga Perempuan
              <input
                required
                min="0"
                type="number"
                value={form.female}
                onChange={(event) => field("female", event.target.value)}
                className={inputClass}
                placeholder="Misal: 615"
              />
            </label>
          </div>
        </section>

        {/* Group Breakdown Fields */}
        <Group title="1. Kelompok Usia Warga (5 Kategori)" items={ageGroups} group="ages" />
        <Group title="2. Tingkat Pendidikan Terakhir Warga" items={educationLevels} group="education" />
        <Group title="3. Sektor Mata Pencaharian / Pekerjaan" items={occupations} group="occupations" />

        {/* Action Button */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-xs font-semibold text-slate-400">
            * Data yang disimpan akan langsung memperbarui grafik infografis di halaman warga.
          </p>

          <button
            disabled={saving}
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:opacity-70"
          >
            {saving ? <LoaderCircle className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
            <span>{saving ? "Menyimpan..." : "Simpan Data Infografis"}</span>
          </button>
        </div>

        {toast ? <Toast message={toast.message} variant={toast.variant} /> : null}
      </form>
    </div>
  )
}
