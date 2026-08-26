"use client"

import { FormEvent, useEffect, useState } from "react"
import { Pencil, Plus, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"

const hamlets = ["Dusun Dopok Sambi", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"]
const types = [
  { value: "KELAHIRAN", label: "Kelahiran" },
  { value: "KEMATIAN", label: "Kematian" },
  { value: "PINDAH_MASUK", label: "Pindah masuk" },
  { value: "PINDAH_KELUAR", label: "Pindah keluar" },
]
const ageGroups = ["0–5", "6–17", "18–35", "36–59", "60+"]
const genders = ["Laki-laki", "Perempuan"] as const

type EventRecord = {
  id: string
  eventDate: string
  type: string
  dusun: string
  fullName: string
  nationalId: string
  familyCardNumber: string
  gender: string
  birthDate: string
  residenceAddress: string
  originAddress: string | null
  destinationAddress: string | null
  notes: string | null
}
type BalanceRecord = { id: string; dusun: string; effectiveDate: string; totalPopulation: number; demographics: unknown }

const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
const blank = () => ({ eventDate: new Date().toISOString().slice(0, 10), type: "KELAHIRAN", dusun: "", fullName: "", nationalId: "", familyCardNumber: "", gender: "Laki-laki", birthDate: "", residenceAddress: "", originAddress: "", destinationAddress: "", notes: "" })
const blankDemographics = () => Object.fromEntries(ageGroups.flatMap((ageGroup) => genders.map((gender) => [`${ageGroup}:${gender}`, ""]))) as Record<string, string>
function demographicInputs(value: unknown) {
  const inputs = blankDemographics()
  if (!Array.isArray(value)) return inputs
  for (const cell of value) {
    if (!cell || typeof cell !== "object") continue
    const item = cell as { ageGroup?: unknown; gender?: unknown; total?: unknown }
    if (typeof item.ageGroup === "string" && typeof item.gender === "string" && ageGroups.includes(item.ageGroup) && genders.includes(item.gender as (typeof genders)[number])) inputs[`${item.ageGroup}:${item.gender}`] = String(item.total ?? 0)
  }
  return inputs
}

export function PopulationEventManager() {
  const [events, setEvents] = useState<EventRecord[]>([])
  const [balances, setBalances] = useState<BalanceRecord[]>([])
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingBalanceId, setEditingBalanceId] = useState<string | null>(null)
  const [balance, setBalance] = useState({ dusun: "", effectiveDate: new Date().toISOString().slice(0, 10), totalPopulation: "", demographics: blankDemographics() })
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null)

  const load = async () => {
    const response = await fetch("/api/admin/infografis/kependudukan", { cache: "no-store" })
    if (!response.ok) throw new Error("Data peristiwa belum dapat dimuat.")
    const data = await response.json()
    setEvents(data.events)
    setBalances(data.balances)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load().catch((error: unknown) => setToast({ message: error instanceof Error ? error.message : "Data belum dapat dimuat.", variant: "error" }))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const setField = (key: keyof ReturnType<typeof blank>, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const moving = form.type === "PINDAH_MASUK" || form.type === "PINDAH_KELUAR"

  async function request(url: string, method: string, body?: unknown) {
    const response = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined })
    const data = response.status === 204 ? null : await response.json()
    if (!response.ok) throw new Error(data?.error ?? "Permintaan tidak dapat diproses.")
    return data
  }

  async function saveBalance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    try {
      await request("/api/admin/infografis/saldo-awal", "POST", {
        ...balance,
        totalPopulation: Number(balance.totalPopulation),
        demographics: ageGroups.flatMap((ageGroup) => genders.map((gender) => ({ ageGroup, gender, total: Number(balance.demographics[`${ageGroup}:${gender}`]) }))),
      })
      await load()
      setEditingBalanceId(null)
      setBalance({ dusun: "", effectiveDate: new Date().toISOString().slice(0, 10), totalPopulation: "", demographics: blankDemographics() })
      setToast({ message: "Data dasar dan komposisi penduduk berhasil disimpan.", variant: "success" })
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Data dasar tidak dapat disimpan.", variant: "error" })
    } finally { setBusy(false) }
  }

  async function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    try {
      await request(editingId ? `/api/admin/infografis/kependudukan/${editingId}` : "/api/admin/infografis/kependudukan", editingId ? "PATCH" : "POST", form)
      await load()
      setForm(blank())
      setEditingId(null)
      setToast({ message: "Catatan peristiwa berhasil disimpan.", variant: "success" })
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Catatan tidak dapat disimpan.", variant: "error" })
    } finally { setBusy(false) }
  }

  function edit(record: EventRecord) {
    setEditingId(record.id)
    setForm({ eventDate: record.eventDate.slice(0, 10), type: record.type, dusun: record.dusun, fullName: record.fullName, nationalId: record.nationalId, familyCardNumber: record.familyCardNumber, gender: record.gender, birthDate: record.birthDate.slice(0, 10), residenceAddress: record.residenceAddress, originAddress: record.originAddress ?? "", destinationAddress: record.destinationAddress ?? "", notes: record.notes ?? "" })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function editBalance(record: BalanceRecord) {
    setEditingBalanceId(record.id)
    setBalance({ dusun: record.dusun, effectiveDate: record.effectiveDate.slice(0, 10), totalPopulation: String(record.totalPopulation), demographics: demographicInputs(record.demographics) })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function removeBalance(record: BalanceRecord) {
    if (!window.confirm(`Hapus data dasar ${record.dusun}?`)) return
    setBusy(true)
    try {
      await request(`/api/admin/infografis/saldo-awal?id=${encodeURIComponent(record.id)}`, "DELETE")
      await load()
      if (editingBalanceId === record.id) {
        setEditingBalanceId(null)
        setBalance({ dusun: "", effectiveDate: new Date().toISOString().slice(0, 10), totalPopulation: "", demographics: blankDemographics() })
      }
      setToast({ message: "Data dasar dihapus.", variant: "success" })
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Data dasar tidak dapat dihapus.", variant: "error" })
    } finally { setBusy(false) }
  }

  async function remove(id: string) {
    if (!window.confirm("Hapus catatan peristiwa ini?")) return
    setBusy(true)
    try {
      await request(`/api/admin/infografis/kependudukan/${id}`, "DELETE")
      await load()
      setToast({ message: "Catatan peristiwa dihapus.", variant: "success" })
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Catatan tidak dapat dihapus.", variant: "error" })
    } finally { setBusy(false) }
  }

  return <section className="space-y-6" aria-labelledby="population-event-manager-title">
    <header><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Dinamika kependudukan</p><h2 id="population-event-manager-title" className="mt-1 text-2xl font-black text-slate-900">Data dasar & peristiwa penduduk</h2><p className="mt-2 text-sm text-slate-600">Masukkan data dasar sekaligus komposisi usia dan jenis kelamin agar piramida penduduk dapat dihitung. Semua data sensitif di bawah ini hanya dapat diakses admin.</p></header>
    <form onSubmit={saveBalance} className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-black text-slate-900">{editingBalanceId ? "Ubah data dasar & komposisi" : "Atur data dasar & komposisi penduduk"}</h3>{editingBalanceId ? <Button type="button" variant="outline" onClick={() => { setEditingBalanceId(null); setBalance({ dusun: "", effectiveDate: new Date().toISOString().slice(0, 10), totalPopulation: "", demographics: blankDemographics() }) }}>Batal ubah</Button> : null}</div><div className="mt-4 grid gap-3 sm:grid-cols-3"><label className="text-xs font-bold text-slate-700">Dusun<select required disabled={Boolean(editingBalanceId)} value={balance.dusun} onChange={(event) => setBalance((current) => ({ ...current, dusun: event.target.value }))} className={inputClass}><option value="">Pilih dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-bold text-slate-700">Tanggal efektif<input required type="date" value={balance.effectiveDate} onChange={(event) => setBalance((current) => ({ ...current, effectiveDate: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Jumlah jiwa<input required min="0" type="number" value={balance.totalPopulation} onChange={(event) => setBalance((current) => ({ ...current, totalPopulation: event.target.value }))} className={inputClass} /></label></div><div className="mt-5 overflow-x-auto rounded-2xl border border-emerald-200 bg-white"><table className="min-w-full text-sm"><thead className="bg-emerald-100/70 text-left text-xs uppercase tracking-wide text-emerald-900"><tr><th className="px-4 py-3">Kelompok usia</th>{genders.map((gender) => <th key={gender} className="px-4 py-3">{gender}</th>)}</tr></thead><tbody>{ageGroups.map((ageGroup) => <tr key={ageGroup} className="border-t border-emerald-100"><td className="px-4 py-3 font-bold text-slate-700">{ageGroup} tahun</td>{genders.map((gender) => <td key={gender} className="px-4 py-2"><input required min="0" type="number" value={balance.demographics[`${ageGroup}:${gender}`]} onChange={(event) => setBalance((current) => ({ ...current, demographics: { ...current.demographics, [`${ageGroup}:${gender}`]: event.target.value } }))} className="h-10 w-32 rounded-lg border border-slate-200 px-3" /></td>)}</tr>)}</tbody></table></div><p className="mt-3 text-xs text-emerald-900">Total 10 kolom komposisi harus sama dengan jumlah jiwa di atas. Peristiwa baru akan otomatis menambah atau mengurangi komposisi sesuai jenis kelamin dan tanggal lahir.</p><div className="mt-4 flex flex-wrap items-center gap-3"><Button type="submit" disabled={busy}><Save />{editingBalanceId ? "Simpan perubahan" : "Simpan data dasar"}</Button></div></form>
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><header className="border-b border-slate-100 p-5"><h3 className="font-black text-slate-900">Data dasar per dusun</h3></header><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Dusun", "Tanggal efektif", "Jumlah jiwa", "Aksi"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{balances.map((record) => <tr key={record.id}><td className="px-4 py-3 font-semibold text-slate-900">{record.dusun}</td><td className="whitespace-nowrap px-4 py-3">{record.effectiveDate.slice(0, 10)}</td><td className="px-4 py-3">{record.totalPopulation.toLocaleString("id-ID")} jiwa</td><td className="whitespace-nowrap px-4 py-3"><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => editBalance(record)}><Pencil />Ubah</Button><Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => removeBalance(record)} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 />Hapus</Button></div></td></tr>)}{!balances.length ? <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">Belum ada data dasar.</td></tr> : null}</tbody></table></div></article>
    <form onSubmit={saveEvent} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-black text-slate-900">{editingId ? "Ubah peristiwa penduduk" : "Input peristiwa penduduk"}</h3><p className="mt-1 text-sm text-slate-500">Biodata lengkap diwajibkan. NIK, KK, alamat, dan catatan tidak dipublikasikan.</p></div>{editingId ? <Button type="button" variant="outline" onClick={() => { setForm(blank()); setEditingId(null) }}>Batal ubah</Button> : null}</div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><label className="text-xs font-bold text-slate-700">Tanggal peristiwa<input required type="date" value={form.eventDate} onChange={(event) => setField("eventDate", event.target.value)} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Jenis peristiwa<select value={form.type} onChange={(event) => setField("type", event.target.value)} className={inputClass}>{types.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="text-xs font-bold text-slate-700">Dusun<select required value={form.dusun} onChange={(event) => setField("dusun", event.target.value)} className={inputClass}><option value="">Pilih dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-bold text-slate-700">Nama lengkap<input required value={form.fullName} onChange={(event) => setField("fullName", event.target.value)} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">NIK<input required inputMode="numeric" value={form.nationalId} onChange={(event) => setField("nationalId", event.target.value)} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Nomor KK<input required inputMode="numeric" value={form.familyCardNumber} onChange={(event) => setField("familyCardNumber", event.target.value)} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Jenis kelamin<select value={form.gender} onChange={(event) => setField("gender", event.target.value)} className={inputClass}><option>Laki-laki</option><option>Perempuan</option></select></label><label className="text-xs font-bold text-slate-700">Tanggal lahir<input required type="date" value={form.birthDate} onChange={(event) => setField("birthDate", event.target.value)} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Alamat domisili<input required value={form.residenceAddress} onChange={(event) => setField("residenceAddress", event.target.value)} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Alamat asal<input required={moving} value={form.originAddress} onChange={(event) => setField("originAddress", event.target.value)} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Alamat tujuan<input required={moving} value={form.destinationAddress} onChange={(event) => setField("destinationAddress", event.target.value)} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Catatan<textarea value={form.notes} onChange={(event) => setField("notes", event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label></div><div className="mt-5"><Button type="submit" disabled={busy}>{editingId ? <Pencil /> : <Plus />}{editingId ? "Simpan perubahan" : "Tambah peristiwa"}</Button></div></form>
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><header className="border-b border-slate-100 p-5"><h3 className="font-black text-slate-900">Catatan terbaru</h3></header><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{["Tanggal", "Peristiwa", "Nama", "NIK", "Dusun", "Aksi"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{events.map((record) => <tr key={record.id}><td className="whitespace-nowrap px-4 py-3">{record.eventDate.slice(0, 10)}</td><td className="whitespace-nowrap px-4 py-3">{types.find((item) => item.value === record.type)?.label}</td><td className="whitespace-nowrap px-4 py-3 font-semibold">{record.fullName}</td><td className="whitespace-nowrap px-4 py-3">{record.nationalId}</td><td className="whitespace-nowrap px-4 py-3">{record.dusun}</td><td className="whitespace-nowrap px-4 py-3"><div className="flex gap-2"><Button type="button" variant="outline" size="sm" onClick={() => edit(record)}><Pencil />Ubah</Button><Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => remove(record.id)} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 />Hapus</Button></div></td></tr>)}{!events.length ? <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Belum ada catatan peristiwa.</td></tr> : null}</tbody></table></div></article>
    {toast ? <Toast message={toast.message} variant={toast.variant} /> : null}
  </section>
}
