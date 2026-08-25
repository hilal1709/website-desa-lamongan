"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Activity, BarChart3, Check, ClipboardPlus, Edit3, HeartPulse, Plus, RefreshCw, Save, Search, Trash2, Users } from "lucide-react"
import { Bar, Line } from "react-chartjs-2"

import "@/components/infografis/chartjs"
import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"

const hamlets = ["Dusun Dopok Sambi", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"]
const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"

type Disease = { id: string; diseaseName: string; normalizedName: string; startedAt: string }
type DiseaseHistory = { id: string; diseaseName: string; startedAt: string; endedAt: string | null }
type Check = { id: string; recordedAt: string; updatedAt: string; systolic: number; diastolic: number; weightKg: number; heightCm: number; bloodGlucoseMgDl: number; notes: string | null }
type Elderly = { id: string; fullName: string; dusun: string; birthDate: string; address: string; isActive: boolean; diseases: Disease[]; diseaseHistory: DiseaseHistory[]; checks: Check[] }
type Session = { id: string; name: string; sessionDate: string; createdBy: { name: string | null; username: string }; _count: { checks: number } }
type Dashboard = {
  metrics: { totalElderly: number; checkedElderly: number; attendanceRate: number; sessionCount: number }
  diseaseTop: { label: string; total: number }[]
  diseaseDusun: { disease: string; total: number; dusun: Record<string, number> }[]
  sessionAttendance: { id: string; name: string; date: string; checked: number; total: number }[]
  measurementTrend: { month: string; systolic: number; diastolic: number; weightKg: number; heightCm: number; bloodGlucoseMgDl: number }[]
}

const emptyDashboard: Dashboard = { metrics: { totalElderly: 0, checkedElderly: 0, attendanceRate: 0, sessionCount: 0 }, diseaseTop: [], diseaseDusun: [], sessionAttendance: [], measurementTrend: [] }
const blankElderly = () => ({ fullName: "", dusun: "", birthDate: "", address: "", diseases: "", isActive: true })
const blankSession = () => ({ name: "", sessionDate: new Date().toISOString().slice(0, 10) })
const blankCheck = () => ({ systolic: "", diastolic: "", weightKg: "", heightCm: "", bloodGlucoseMgDl: "", notes: "" })

function dateLabel(value: string) { return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value)) }
function age(value: string) { const birth = new Date(value); const today = new Date(); let years = today.getFullYear() - birth.getFullYear(); if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) years -= 1; return years }
function metricLabel(metric: string) { return ({ systolic: "Sistolik", diastolic: "Diastolik", weightKg: "Berat badan (kg)", heightCm: "Tinggi badan (cm)", bloodGlucoseMgDl: "Gula darah (mg/dL)" } as Record<string, string>)[metric] }

export function ElderlyHealthManager({ canManageAccounts = false, showDashboard = false }: { canManageAccounts?: boolean; showDashboard?: boolean }) {
  const [elderly, setElderly] = useState<Elderly[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [dashboard, setDashboard] = useState<Dashboard>(emptyDashboard)
  const [selectedSessionId, setSelectedSessionId] = useState("")
  const [activeTab, setActiveTab] = useState<"dashboard" | "lansia" | "posyandu" | "akun">(showDashboard ? "dashboard" : "lansia")
  const [search, setSearch] = useState("")
  const [dusunFilter, setDusunFilter] = useState("")
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
  const [elderlyForm, setElderlyForm] = useState(blankElderly)
  const [editingElderlyId, setEditingElderlyId] = useState<string | null>(null)
  const [sessionForm, setSessionForm] = useState(blankSession)
  const [checkForm, setCheckForm] = useState(blankCheck)
  const [checkingElderlyId, setCheckingElderlyId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null)

  async function request<T>(url: string, method = "GET", body?: unknown): Promise<T> {
    const response = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, cache: "no-store" })
    const data = response.status === 204 ? null : await response.json()
    if (!response.ok) throw new Error(data?.error ?? "Permintaan tidak dapat diproses.")
    return data as T
  }

  async function loadSessions() {
    const data = await request<{ sessions: Session[] }>("/api/kesehatan/sesi")
    setSessions(data.sessions)
    setSelectedSessionId((current) => current || data.sessions[0]?.id || "")
  }

  async function loadElderly(sessionId = selectedSessionId) {
    const params = new URLSearchParams()
    if (sessionId) params.set("sessionId", sessionId)
    if (search.trim()) params.set("search", search.trim())
    if (dusunFilter) params.set("dusun", dusunFilter)
    const data = await request<{ elderly: Elderly[] }>(`/api/kesehatan/lansia?${params}`)
    setElderly(data.elderly)
  }

  async function loadDashboard() {
    const params = new URLSearchParams()
    if (dusunFilter) params.set("dusun", dusunFilter)
    if (dateFilter.from) params.set("from", dateFilter.from)
    if (dateFilter.to) params.set("to", dateFilter.to)
    const data = await request<Dashboard>(`/api/kesehatan/dashboard?${params}`)
    setDashboard(data)
  }

  async function loadEverything() {
    try {
      await Promise.all([loadSessions(), ...(showDashboard ? [loadDashboard()] : [])])
      await loadElderly()
    } catch (error) { setToast({ message: error instanceof Error ? error.message : "Data kesehatan belum dapat dimuat.", variant: "error" }) }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadEverything() }, 0)
    return () => window.clearTimeout(timer)
    // Initial data is intentionally loaded once; form interactions refresh it explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const timer = window.setTimeout(() => { if (selectedSessionId) void loadElderly(selectedSessionId).catch((error: unknown) => setToast({ message: error instanceof Error ? error.message : "Data belum dapat dimuat.", variant: "error" })) }, 0)
    return () => window.clearTimeout(timer)
    // Loading the selected session is isolated from form-state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSessionId])

  const selectedSession = sessions.find((session) => session.id === selectedSessionId)
  const activeElderly = elderly.filter((person) => person.isActive)
  const tabs = [...(showDashboard ? [{ id: "dashboard", label: "Dashboard", icon: BarChart3 }] : []), { id: "lansia", label: "Data Lansia", icon: Users }, { id: "posyandu", label: "Posyandu", icon: ClipboardPlus }] as const

  async function saveElderly(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true)
    try {
      const payload = { ...elderlyForm, diseases: elderlyForm.diseases.split(",").map((item) => item.trim()).filter(Boolean) }
      await request(editingElderlyId ? `/api/kesehatan/lansia/${editingElderlyId}` : "/api/kesehatan/lansia", editingElderlyId ? "PATCH" : "POST", payload)
      setElderlyForm(blankElderly()); setEditingElderlyId(null); await Promise.all([loadElderly(), loadDashboard()]); setToast({ message: "Data lansia berhasil disimpan.", variant: "success" })
    } catch (error) { setToast({ message: error instanceof Error ? error.message : "Data lansia tidak dapat disimpan.", variant: "error" }) } finally { setBusy(false) }
  }

  function editElderly(person: Elderly) {
    setEditingElderlyId(person.id)
    setElderlyForm({ fullName: person.fullName, dusun: person.dusun, birthDate: person.birthDate.slice(0, 10), address: person.address, diseases: person.diseases.map((disease) => disease.diseaseName).join(", "), isActive: person.isActive })
    setActiveTab("lansia"); window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function removeElderly(person: Elderly) {
    if (!window.confirm(`Hapus permanen data ${person.fullName}, seluruh riwayat penyakit, dan pemeriksaannya?`)) return
    setBusy(true)
    try {
      await request(`/api/kesehatan/lansia/${person.id}`, "DELETE")
      if (editingElderlyId === person.id) { setEditingElderlyId(null); setElderlyForm(blankElderly()) }
      await Promise.all([loadElderly(), ...(showDashboard ? [loadDashboard()] : [])])
      setToast({ message: "Data lansia berhasil dihapus permanen.", variant: "success" })
    } catch (error) { setToast({ message: error instanceof Error ? error.message : "Data lansia tidak dapat dihapus.", variant: "error" }) } finally { setBusy(false) }
  }

  async function saveSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true)
    try {
      const created = await request<Session>("/api/kesehatan/sesi", "POST", sessionForm)
      setSessionForm(blankSession()); await loadSessions(); setSelectedSessionId(created.id); await loadDashboard(); setToast({ message: "Sesi posyandu berhasil dibuat.", variant: "success" })
    } catch (error) { setToast({ message: error instanceof Error ? error.message : "Sesi tidak dapat dibuat.", variant: "error" }) } finally { setBusy(false) }
  }

  async function removeSession() {
    if (!selectedSession) return
    if (!window.confirm(`Hapus permanen sesi ${selectedSession.name} beserta seluruh pemeriksaannya?`)) return
    setBusy(true)
    try {
      await request(`/api/kesehatan/sesi/${selectedSession.id}`, "DELETE")
      setSelectedSessionId("")
      await Promise.all([loadSessions(), loadElderly(""), ...(showDashboard ? [loadDashboard()] : [])])
      setToast({ message: "Sesi posyandu berhasil dihapus permanen.", variant: "success" })
    } catch (error) { setToast({ message: error instanceof Error ? error.message : "Sesi posyandu tidak dapat dihapus.", variant: "error" }) } finally { setBusy(false) }
  }

  function openCheck(person: Elderly) {
    const current = person.checks[0]
    setCheckingElderlyId(person.id)
    setCheckForm(current ? { systolic: String(current.systolic), diastolic: String(current.diastolic), weightKg: String(current.weightKg), heightCm: String(current.heightCm), bloodGlucoseMgDl: String(current.bloodGlucoseMgDl), notes: current.notes ?? "" } : blankCheck())
  }

  async function saveCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedSessionId || !checkingElderlyId) return
    setBusy(true)
    try {
      await request("/api/kesehatan/pemeriksaan", "POST", { ...checkForm, sessionId: selectedSessionId, elderlyId: checkingElderlyId })
      setCheckingElderlyId(null); await Promise.all([loadElderly(), loadSessions(), loadDashboard()]); setToast({ message: "Pemeriksaan berhasil disimpan.", variant: "success" })
    } catch (error) { setToast({ message: error instanceof Error ? error.message : "Pemeriksaan tidak dapat disimpan.", variant: "error" }) } finally { setBusy(false) }
  }


  const diseaseBar = useMemo(() => ({ labels: dashboard.diseaseTop.map((item) => item.label), datasets: [{ label: "Lansia dengan penyakit aktif", data: dashboard.diseaseTop.map((item) => item.total), backgroundColor: "#047857", borderRadius: 8 }] }), [dashboard])
  const attendanceBar = useMemo(() => ({ labels: dashboard.sessionAttendance.map((item) => `${item.name} (${dateLabel(item.date)})`), datasets: [{ label: "Sudah diperiksa", data: dashboard.sessionAttendance.map((item) => item.checked), backgroundColor: "#0f766e", borderRadius: 8 }] }), [dashboard])
  const [trendMetric, setTrendMetric] = useState<"systolic" | "diastolic" | "weightKg" | "heightCm" | "bloodGlucoseMgDl">("systolic")
  const trendLine = useMemo(() => ({ labels: dashboard.measurementTrend.map((item) => item.month), datasets: [{ label: `Rata-rata ${metricLabel(trendMetric)}`, data: dashboard.measurementTrend.map((item) => item[trendMetric]), borderColor: "#047857", backgroundColor: "rgba(4,120,87,.12)", fill: true, tension: .3 }] }), [dashboard, trendMetric])

  return <section className="mx-auto max-w-7xl space-y-5 py-1" aria-labelledby="elderly-health-title">
    <header className="rounded-[28px] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-5 text-white shadow-lg sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="grid size-12 place-items-center rounded-2xl bg-white/15"><HeartPulse className="size-6" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Layanan kesehatan internal</p><h1 id="elderly-health-title" className="mt-1 text-2xl font-black sm:text-3xl">Rekam Medis Lansia & Posyandu</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">Kelola data warga lansia dan pemeriksaan posyandu secara aman. Data ini tidak ditampilkan di website publik.</p></div><Button type="button" variant="secondary" onClick={() => void loadEverything()} disabled={busy}><RefreshCw className={busy ? "animate-spin" : ""} />Muat ulang</Button></div></header>

    <nav aria-label="Navigasi modul kesehatan" className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id as "dashboard" | "lansia" | "posyandu" | "akun")} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeTab === id ? "bg-emerald-700 text-white" : "text-slate-600 hover:bg-emerald-50"}`}><Icon className="size-4" />{label}</button>)}</nav>

    {activeTab === "dashboard" ? <div className="space-y-5"><section className="rounded-2xl border border-slate-200 bg-white p-4"><div className="grid gap-3 sm:grid-cols-3"><label className="text-xs font-bold text-slate-700">Filter dusun<select value={dusunFilter} onChange={(event) => setDusunFilter(event.target.value)} className={inputClass}><option value="">Semua dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-bold text-slate-700">Dari tanggal<input type="date" value={dateFilter.from} onChange={(event) => setDateFilter((value) => ({ ...value, from: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Sampai tanggal<input type="date" value={dateFilter.to} onChange={(event) => setDateFilter((value) => ({ ...value, to: event.target.value }))} className={inputClass} /></label></div><div className="mt-3"><Button type="button" size="sm" onClick={() => void loadDashboard()}><BarChart3 />Terapkan filter</Button></div></section><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "Lansia aktif", value: dashboard.metrics.totalElderly, icon: Users }, { label: "Sudah diperiksa", value: dashboard.metrics.checkedElderly, icon: Check }, { label: "Kehadiran", value: `${dashboard.metrics.attendanceRate}%`, icon: Activity }, { label: "Sesi pada periode", value: dashboard.metrics.sessionCount, icon: ClipboardPlus }].map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="size-5" /></span><p className="mt-5 text-2xl font-black text-slate-950">{value}</p><p className="mt-1 text-sm font-semibold text-slate-600">{label}</p></article>)}</div><div className="grid gap-5 xl:grid-cols-2"><ChartCard title="Penyakit aktif terbanyak" empty={!dashboard.diseaseTop.length}><Bar data={diseaseBar} options={{ responsive: true, plugins: { legend: { display: false } } }} /></ChartCard><ChartCard title="Kehadiran per sesi" empty={!dashboard.sessionAttendance.length}><Bar data={attendanceBar} options={{ responsive: true, plugins: { legend: { display: false } } }} /></ChartCard></div><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-black text-slate-900">Tren pengukuran bulanan</h2><select value={trendMetric} onChange={(event) => setTrendMetric(event.target.value as typeof trendMetric)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700">{["systolic", "diastolic", "weightKg", "heightCm", "bloodGlucoseMgDl"].map((metric) => <option key={metric} value={metric}>{metricLabel(metric)}</option>)}</select></div>{dashboard.measurementTrend.length ? <div className="mt-5 h-72"><Line data={trendLine} options={{ responsive: true, maintainAspectRatio: false }} /></div> : <EmptyChart />}</article><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black text-slate-900">Sebaran penyakit aktif per dusun</h2>{dashboard.diseaseDusun.length ? <div className="mt-4 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Penyakit</th>{hamlets.map((hamlet) => <th key={hamlet} className="px-3 py-2">{hamlet.replace("Dusun ", "")}</th>)}<th className="px-3 py-2">Total</th></tr></thead><tbody>{dashboard.diseaseDusun.map((item) => <tr key={item.disease} className="border-b border-slate-100"><td className="px-3 py-3 font-bold text-slate-800">{item.disease}</td>{hamlets.map((hamlet) => <td key={hamlet} className="px-3 py-3">{item.dusun[hamlet] ?? 0}</td>)}<td className="px-3 py-3 font-bold">{item.total}</td></tr>)}</tbody></table></div> : <EmptyChart />}</article></div> : null}

    {activeTab === "lansia" ? <div className="space-y-5"><form onSubmit={saveElderly} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-black text-slate-900">{editingElderlyId ? "Ubah data lansia" : "Tambah lansia"}</h2><p className="mt-1 text-sm text-slate-600">Penyakit dapat ditulis bebas dan dipisahkan dengan koma.</p></div>{editingElderlyId ? <Button type="button" variant="outline" onClick={() => { setEditingElderlyId(null); setElderlyForm(blankElderly()) }}>Batal</Button> : null}</div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="text-xs font-bold text-slate-700">Nama lengkap<input required value={elderlyForm.fullName} onChange={(event) => setElderlyForm((value) => ({ ...value, fullName: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Dusun<select required value={elderlyForm.dusun} onChange={(event) => setElderlyForm((value) => ({ ...value, dusun: event.target.value }))} className={inputClass}><option value="">Pilih dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-bold text-slate-700">Tanggal lahir<input required type="date" value={elderlyForm.birthDate} onChange={(event) => setElderlyForm((value) => ({ ...value, birthDate: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Status<select value={elderlyForm.isActive ? "active" : "inactive"} onChange={(event) => setElderlyForm((value) => ({ ...value, isActive: event.target.value === "active" }))} className={inputClass}><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></label><label className="text-xs font-bold text-slate-700 sm:col-span-2">Alamat<input required value={elderlyForm.address} onChange={(event) => setElderlyForm((value) => ({ ...value, address: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-slate-700 sm:col-span-2">Penyakit aktif<input value={elderlyForm.diseases} onChange={(event) => setElderlyForm((value) => ({ ...value, diseases: event.target.value }))} placeholder="Contoh: Hipertensi, Diabetes" className={inputClass} /></label></div><div className="mt-4"><Button type="submit" disabled={busy}>{editingElderlyId ? <Save /> : <Plus />}{editingElderlyId ? "Simpan perubahan" : "Simpan lansia"}</Button></div></form><section className="rounded-2xl border border-slate-200 bg-white p-4"><div className="grid gap-3 sm:grid-cols-[1fr_220px_auto]"><label className="relative"><span className="sr-only">Cari lansia</span><Search className="absolute left-3 top-3 size-5 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama lansia" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-emerald-600" /></label><select value={dusunFilter} onChange={(event) => setDusunFilter(event.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700"><option value="">Semua dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</select><Button type="button" onClick={() => void loadElderly()}><Search />Cari</Button></div></section><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{elderly.map((person) => <article key={person.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${person.isActive ? "border-slate-200" : "border-slate-300 opacity-70"}`}><div className="flex items-start justify-between gap-3"><div><h2 className="font-black text-slate-900">{person.fullName}</h2><p className="mt-1 text-sm text-slate-500">{person.dusun} · {age(person.birthDate)} tahun</p></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => editElderly(person)}><Edit3 />Ubah</Button>{canManageAccounts ? <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => void removeElderly(person)} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 />Hapus</Button> : null}</div></div><p className="mt-4 text-sm leading-6 text-slate-600">{person.address}</p><div className="mt-4 flex flex-wrap gap-2">{person.diseases.length ? person.diseases.map((disease) => <span key={disease.id} className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">{disease.diseaseName}</span>) : <span className="text-xs font-semibold text-slate-400">Tidak ada penyakit aktif tercatat</span>}</div>{person.diseaseHistory.some((disease) => disease.endedAt) ? <details className="mt-4 text-xs"><summary className="cursor-pointer font-bold text-slate-600">Riwayat penyakit</summary><ul className="mt-2 space-y-1 text-slate-500">{person.diseaseHistory.filter((disease) => disease.endedAt).map((disease) => <li key={disease.id}>{disease.diseaseName} · berakhir {dateLabel(disease.endedAt!)}</li>)}</ul></details> : null}{!person.isActive ? <p className="mt-4 text-xs font-bold text-slate-500">Profil nonaktif</p> : null}</article>)}{!elderly.length ? <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">Belum ada data lansia yang sesuai.</p> : null}</div></div> : null}

    {activeTab === "posyandu" ? <div className="space-y-5"><form onSubmit={saveSession} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5"><h2 className="font-black text-slate-900">Buat sesi posyandu</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><label className="text-xs font-bold text-slate-700 sm:col-span-2">Nama sesi<input required value={sessionForm.name} onChange={(event) => setSessionForm((value) => ({ ...value, name: event.target.value }))} placeholder="Contoh: Posyandu Lansia Balai Desa" className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Tanggal sesi<input required type="date" value={sessionForm.sessionDate} onChange={(event) => setSessionForm((value) => ({ ...value, sessionDate: event.target.value }))} className={inputClass} /></label></div><div className="mt-4"><Button type="submit" disabled={busy}><Plus />Buat sesi</Button></div></form><section className="rounded-2xl border border-slate-200 bg-white p-4"><label className="text-xs font-bold text-slate-700">Sesi aktif<select value={selectedSessionId} onChange={(event) => setSelectedSessionId(event.target.value)} className={inputClass}><option value="">Pilih sesi posyandu</option>{sessions.map((session) => <option key={session.id} value={session.id}>{dateLabel(session.sessionDate)} — {session.name} ({session._count.checks} diperiksa)</option>)}</select></label></section>{selectedSession ? <><header className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-black text-slate-950">Kartu digital: {selectedSession.name}</h2><p className="mt-1 text-sm text-slate-600">{dateLabel(selectedSession.sessionDate)} · sentuh tombol pemeriksaan untuk mencentang warga dan menyimpan hasilnya.</p></div>{canManageAccounts ? <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => void removeSession()} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 />Hapus sesi</Button> : null}</header><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{activeElderly.map((person) => { const checked = person.checks?.[0]; const editing = checkingElderlyId === person.id; return <article key={person.id} className={`rounded-2xl border p-5 shadow-sm ${checked ? "border-emerald-300 bg-emerald-50/40" : "border-slate-200 bg-white"}`}><div className="flex items-start justify-between gap-3"><div><h3 className="font-black text-slate-900">{person.fullName}</h3><p className="mt-1 text-sm text-slate-500">{person.dusun} · {age(person.birthDate)} tahun</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-black ${checked ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>{checked ? "Sudah diperiksa" : "Belum diperiksa"}</span></div><div className="mt-3 flex flex-wrap gap-1.5">{person.diseases.map((disease) => <span key={disease.id} className="rounded-full bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">{disease.diseaseName}</span>)}</div>{checked ? <p className="mt-4 text-xs leading-5 text-emerald-900">TD {checked.systolic}/{checked.diastolic} · BB {checked.weightKg} kg · TB {checked.heightCm} cm · Gula {checked.bloodGlucoseMgDl} mg/dL</p> : null}<div className="mt-4"><Button type="button" size="sm" onClick={() => openCheck(person)}><Check />{checked ? "Ubah hasil" : "Centang pemeriksaan"}</Button></div>{editing ? <form onSubmit={saveCheck} className="mt-4 rounded-xl border border-emerald-200 bg-white p-3"><div className="grid grid-cols-2 gap-2"><SmallInput label="Sistolik" value={checkForm.systolic} onChange={(value) => setCheckForm((state) => ({ ...state, systolic: value }))} /><SmallInput label="Diastolik" value={checkForm.diastolic} onChange={(value) => setCheckForm((state) => ({ ...state, diastolic: value }))} /><SmallInput label="Berat (kg)" value={checkForm.weightKg} onChange={(value) => setCheckForm((state) => ({ ...state, weightKg: value }))} /><SmallInput label="Tinggi (cm)" value={checkForm.heightCm} onChange={(value) => setCheckForm((state) => ({ ...state, heightCm: value }))} /><SmallInput label="Gula (mg/dL)" value={checkForm.bloodGlucoseMgDl} onChange={(value) => setCheckForm((state) => ({ ...state, bloodGlucoseMgDl: value }))} /></div><label className="mt-2 block text-xs font-bold text-slate-700">Catatan<textarea value={checkForm.notes} onChange={(event) => setCheckForm((state) => ({ ...state, notes: event.target.value }))} className="mt-1 min-h-16 w-full rounded-lg border border-slate-200 p-2 text-sm" /></label><div className="mt-3 flex gap-2"><Button type="submit" size="sm" disabled={busy}><Save />Simpan</Button><Button type="button" size="sm" variant="ghost" onClick={() => setCheckingElderlyId(null)}>Batal</Button></div></form> : null}</article> })}</div></> : <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">Buat atau pilih sesi posyandu untuk menampilkan kartu digital.</p>}</div> : null}

    {toast ? <Toast message={toast.message} variant={toast.variant} /> : null}
  </section>
}

function SmallInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="text-[11px] font-bold text-slate-600">{label}<input required min="0.01" inputMode="decimal" type="number" step="any" value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-2 text-sm" /></label> }
function EmptyChart() { return <p className="grid h-56 place-items-center text-center text-sm text-slate-500">Belum ada data yang cukup untuk ditampilkan.</p> }
function ChartCard({ title, empty, children }: { title: string; empty: boolean; children: React.ReactNode }) { return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black text-slate-900">{title}</h2><div className="mt-5 h-72">{empty ? <EmptyChart /> : children}</div></article> }
