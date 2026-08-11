"use client"

import { useEffect, useState } from "react"
import { LoaderCircle, Save } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Toast } from "@/components/ui/toast"

const hamlets = ["Dusun Dopok", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"]
const ageGroups = ["0-5", "6-17", "18-35", "36-59", "60+"]
const educationLevels = ["SD", "SMP", "SMA", "Perguruan Tinggi"]
const occupations = ["Petani", "UMKM/Wirausaha", "Karyawan Swasta", "PNS/ASN", "Guru/Tenaga Pendidikan", "Perangkat Desa", "Pelajar/Mahasiswa", "Belum/Tidak Bekerja"]
const blankValues = (items: string[]) => Object.fromEntries(items.map((item) => [item, ""])) as Record<string, string>
const toValues = (rows: { total: number; [key: string]: unknown }[], field: string, items: string[]) => Object.fromEntries(items.map((item) => [item, String(rows.find((row) => row[field] === item)?.total ?? "")])) as Record<string, string>
const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"

export function InfographicForm() {
  const [form, setForm] = useState({ year: String(new Date().getFullYear()), dusun: "", population: "", households: "", male: "", female: "", ages: blankValues(ageGroups), education: blankValues(educationLevels), occupations: blankValues(occupations) })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null)
  const field = (key: "population" | "households" | "male" | "female", value: string) => setForm((current) => ({ ...current, [key]: value }))
  const groupField = (group: "ages" | "education" | "occupations", key: string, value: string) => setForm((current) => ({ ...current, [group]: { ...current[group], [key]: value } }))

  useEffect(() => {
    if (!form.dusun) return
    let active = true
    async function loadExisting() {
      const year = Number(form.year)
      const [population, ages, education, occupationRows] = await Promise.all([supabase.from("infographic_stats").select("*").eq("year", year).eq("dusun", form.dusun).maybeSingle(), supabase.from("age_group_stats").select("*").eq("year", year).eq("dusun", form.dusun), supabase.from("education_stats").select("*").eq("year", year).eq("dusun", form.dusun), supabase.from("occupation_stats").select("*").eq("year", year).eq("dusun", form.dusun)])
      if (!active) return
      setForm((current) => ({ ...current, population: population.data ? String(population.data.total_population) : "", households: population.data ? String(population.data.total_households) : "", male: population.data ? String(population.data.male) : "", female: population.data ? String(population.data.female) : "", ages: toValues(ages.data ?? [], "age_group", ageGroups), education: toValues(education.data ?? [], "education_level", educationLevels), occupations: toValues(occupationRows.data ?? [], "occupation", occupations) }))
    }
    void loadExisting()
    return () => { active = false }
  }, [form.year, form.dusun])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setToast(null)
    const year = Number(form.year); const dusun = form.dusun
    if (Number(form.male) + Number(form.female) !== Number(form.population)) { setSaving(false); setToast({ message: "Jumlah laki-laki dan perempuan harus sama dengan total penduduk.", variant: "error" }); return }
    const population = { year, dusun, total_population: Number(form.population), total_households: Number(form.households), male: Number(form.male), female: Number(form.female) }
    const ageRows = ageGroups.map((age_group) => ({ year, dusun, age_group, total: Number(form.ages[age_group] || 0) }))
    const educationRows = educationLevels.map((education_level) => ({ year, dusun, education_level, total: Number(form.education[education_level] || 0) }))
    const occupationRows = occupations.map((occupation) => ({ year, dusun, occupation, total: Number(form.occupations[occupation] || 0) }))
    const { error: populationError } = await supabase.from("infographic_stats").upsert(population, { onConflict: "year,dusun" })
    if (!populationError) { const [ageDelete, educationDelete, occupationDelete] = await Promise.all([supabase.from("age_group_stats").delete().eq("year", year).eq("dusun", dusun), supabase.from("education_stats").delete().eq("year", year).eq("dusun", dusun), supabase.from("occupation_stats").delete().eq("year", year).eq("dusun", dusun)]); const detailError = ageDelete.error ?? educationDelete.error ?? occupationDelete.error; if (!detailError) { const [ageInsert, educationInsert, occupationInsert] = await Promise.all([supabase.from("age_group_stats").insert(ageRows), supabase.from("education_stats").insert(educationRows), supabase.from("occupation_stats").insert(occupationRows)]); const error = ageInsert.error ?? educationInsert.error ?? occupationInsert.error; if (!error) { const { data: yearStats, error: trendReadError } = await supabase.from("infographic_stats").select("total_population").eq("year", year); const trendTotal = (yearStats ?? []).reduce((sum, row) => sum + Number(row.total_population), 0); const { error: trendError } = trendReadError ? { error: trendReadError } : await supabase.from("population_trends").upsert({ year, total_population: trendTotal }, { onConflict: "year" }); if (!trendError) { setToast({ message: "Data infografis berhasil disimpan.", variant: "success" }); setSaving(false); return } } } }
    setSaving(false); setToast({ message: "Data gagal disimpan. Periksa struktur tabel dan coba lagi.", variant: "error" })
  }
  const Group = ({ title, items, group }: { title: string; items: string[]; group: "ages" | "education" | "occupations" }) => <section className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><h3 className="font-bold text-slate-900">{title}</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{items.map((item) => <label key={item} className="text-sm font-semibold text-slate-600">{item}<input min="0" type="number" value={form[group][item]} onChange={(event) => groupField(group, item, event.target.value)} className={inputClass}/></label>)}</div></section>
  return <form onSubmit={submit} className="space-y-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-7"><section><h2 className="text-lg font-bold text-slate-950">Data kependudukan</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Tahun<input required min="2000" max="2100" type="number" value={form.year} onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))} className={inputClass}/></label><label className="text-sm font-bold text-slate-700">Dusun<select required value={form.dusun} onChange={(event) => setForm((current) => ({ ...current, dusun: event.target.value }))} className={inputClass}><option value="" disabled>Pilih dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-bold text-slate-700">Total Penduduk<input required min="0" type="number" value={form.population} onChange={(event) => field("population", event.target.value)} className={inputClass}/></label><label className="text-sm font-bold text-slate-700">Total Kepala Keluarga<input required min="0" type="number" value={form.households} onChange={(event) => field("households", event.target.value)} className={inputClass}/></label><label className="text-sm font-bold text-slate-700">Laki-laki<input required min="0" type="number" value={form.male} onChange={(event) => field("male", event.target.value)} className={inputClass}/></label><label className="text-sm font-bold text-slate-700">Perempuan<input required min="0" type="number" value={form.female} onChange={(event) => field("female", event.target.value)} className={inputClass}/></label></div></section><Group title="Kelompok usia" items={ageGroups} group="ages"/><Group title="Pendidikan" items={educationLevels} group="education"/><Group title="Mata pencaharian" items={occupations} group="occupations"/><div className="flex justify-end border-t border-slate-100 pt-5"><button disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-70">{saving ? <LoaderCircle className="animate-spin" size={18}/> : <Save size={18}/>}{saving ? "Menyimpan..." : "Simpan data"}</button></div>{toast ? <Toast message={toast.message} variant={toast.variant}/> : null}</form>
}
