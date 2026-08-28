"use client"


import { BrowserlessSelect } from "@/components/ui/select"
import { LegacyDatePicker } from "@/components/ui/date-picker"
import { age, dateLabel, hamlets, inputClass, metricLabel } from "@/components/lansia/elderly-health-utils"
import type { Dashboard, Elderly, Pagination, Session } from "@/components/lansia/elderly-health-types"
import { ElderlyPagination } from "@/components/lansia/elderly-pagination"
import dynamic from "next/dynamic"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { Activity, AlertTriangle, BarChart3, Check, ClipboardPlus, Edit3, HeartPulse, Plus, RefreshCw, Save, Search, Sparkles, Trash2, Users } from "@/components/lansia/lansia-icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const HealthBar = dynamic(() => import("@/components/lansia/health-charts").then((module) => module.HealthBar), { ssr: false })
const HealthLine = dynamic(() => import("@/components/lansia/health-charts").then((module) => module.HealthLine), { ssr: false })
const Bar = HealthBar
const Line = HealthLine

const emptyDashboard: Dashboard = { metrics: { totalElderly: 0, checkedElderly: 0, attendanceRate: 0, sessionCount: 0 }, diseaseTop: [], diseaseDusun: [], sessionAttendance: [], measurementTrend: [] }
const emptyPagination: Pagination = { page: 1, pageSize: 9, totalItems: 0, totalPages: 1 }
const blankElderly = () => ({ fullName: "", dusun: "", birthDate: "", address: "", diseases: "", isActive: true })
const blankSession = () => ({ name: "", sessionDate: new Date().toISOString().slice(0, 10) })
const blankCheck = () => ({ systolic: "", diastolic: "", weightKg: "", heightCm: "", bloodGlucoseMgDl: "", notes: "" })


export function ElderlyHealthManager({ canManageAccounts = false, showDashboard = false, initialElderly = [], initialSessions = [], initialPagination }: { canManageAccounts?: boolean; showDashboard?: boolean; initialElderly?: Elderly[]; initialSessions?: Session[]; initialPagination?: Pagination }) {
  const motionRoot = useRef<HTMLElement>(null)
  const [elderly, setElderly] = useState<Elderly[]>(initialElderly)
  const [pagination, setPagination] = useState<Pagination>(initialPagination ?? { ...emptyPagination, totalItems: initialElderly.length })
  const [page, setPage] = useState(1)
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [dashboard, setDashboard] = useState<Dashboard>(emptyDashboard)
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessions[0]?.id ?? "")
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
  const [deleteTarget, setDeleteTarget] = useState<{ kind: "elderly" | "session"; id: string; name: string } | null>(null)
  const deleteDialogRef = useRef<HTMLDivElement>(null)
  const noticeDialogRef = useRef<HTMLDivElement>(null)

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

  async function loadElderly(sessionId = selectedSessionId, requestedPage = page) {
    const params = new URLSearchParams()
    if (sessionId) params.set("sessionId", sessionId)
    if (search.trim()) params.set("search", search.trim())
    if (dusunFilter) params.set("dusun", dusunFilter)
    params.set("page", String(requestedPage))
    const data = await request<{ elderly: Elderly[]; pagination: Pagination }>(`/api/kesehatan/lansia?${params}`)
    setElderly(data.elderly)
    setPagination(data.pagination)
    setPage(data.pagination.page)
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

  const initialLoad = useRef(true)
  useEffect(() => {
    if (initialElderly.length || initialSessions.length) return
    const timer = window.setTimeout(() => { void loadEverything() }, 0)
    return () => window.clearTimeout(timer)
    // Initial data is intentionally loaded once; form interactions refresh it explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (initialLoad.current) { initialLoad.current = false; return }
    const timer = window.setTimeout(() => { if (selectedSessionId) void loadElderly(selectedSessionId).catch((error: unknown) => setToast({ message: error instanceof Error ? error.message : "Data belum dapat dimuat.", variant: "error" })) }, 0)
    return () => window.clearTimeout(timer)
    // Loading the selected session is isolated from form-state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSessionId])
  useEffect(() => {
    if (page === 1) return
    void loadElderly(selectedSessionId, page).catch((error: unknown) => setToast({ message: error instanceof Error ? error.message : "Data belum dapat dimuat.", variant: "error" }))
    // Page changes deliberately reload the current query and selected Posyandu session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (!motionRoot.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanups: (() => void)[] = []
    const timer = window.setTimeout(() => void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !motionRoot.current) return
      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-elderly-card], .grid > article", motionRoot.current)
        gsap.fromTo("[data-elderly-panel]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .48, stagger: .07, ease: "power3.out", clearProps: "opacity,transform,visibility" })
        gsap.fromTo(cards, { autoAlpha: 0, y: 18, scale: .985 }, { autoAlpha: 1, y: 0, scale: 1, duration: .42, stagger: .055, ease: "power3.out", clearProps: "opacity,transform,visibility" })
        gsap.to("[data-elderly-orb]", { x: 22, y: -13, scale: 1.12, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to("[data-elderly-pulse]", { scale: 1.16, autoAlpha: .34, duration: 1.25, repeat: -1, yoyo: true, ease: "sine.inOut" })
        cards.forEach((card) => {
          const enter = () => gsap.to(card, { y: -5, scale: 1.01, duration: .22, ease: "power2.out", overwrite: "auto" })
          const leave = () => gsap.to(card, { y: 0, scale: 1, duration: .3, ease: "power3.out", overwrite: "auto" })
          card.addEventListener("mouseenter", enter); card.addEventListener("mouseleave", leave)
          cleanups.push(() => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave) })
        })
      }, motionRoot)
    }), 80)
    return () => { cancelled = true; window.clearTimeout(timer); cleanups.forEach((cleanup) => cleanup()); context?.revert() }
  }, [activeTab, elderly.length, sessions.length])

  useEffect(() => {
    if (!deleteTarget || !deleteDialogRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!deleteDialogRef.current) return
      context = gsap.context(() => {
        gsap.fromTo(deleteDialogRef.current, { autoAlpha: 0, y: 20, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .3, ease: "power3.out" })
        gsap.fromTo("[data-delete-dialog-item]", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .28, stagger: .07, delay: .08, ease: "power2.out" })
      }, deleteDialogRef)
    })
    return () => context?.revert()
  }, [deleteTarget])

  useEffect(() => {
    if (!toast || !noticeDialogRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!noticeDialogRef.current) return
      context = gsap.context(() => {
        gsap.fromTo(noticeDialogRef.current, { autoAlpha: 0, y: 16, scale: .97 }, { autoAlpha: 1, y: 0, scale: 1, duration: .32, ease: "power3.out" })
        gsap.fromTo("[data-notice-dialog-item]", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .24, stagger: .06, delay: .08, ease: "power2.out" })
      }, noticeDialogRef)
    })
    return () => context?.revert()
  }, [toast])

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

  async function removeElderly(person: Elderly, confirmed = false) {
    if (!confirmed) { setDeleteTarget({ kind: "elderly", id: person.id, name: person.fullName }); return }
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

  async function removeSession(confirmed = false) {
    if (!selectedSession) return
    if (!confirmed) { setDeleteTarget({ kind: "session", id: selectedSession.id, name: selectedSession.name }); return }
    setBusy(true)
    try {
      await request(`/api/kesehatan/sesi/${selectedSession.id}`, "DELETE")
      setSelectedSessionId("")
      await Promise.all([loadSessions(), loadElderly(""), ...(showDashboard ? [loadDashboard()] : [])])
      setToast({ message: "Sesi posyandu berhasil dihapus permanen.", variant: "success" })
    } catch (error) { setToast({ message: error instanceof Error ? error.message : "Sesi posyandu tidak dapat dihapus.", variant: "error" }) } finally { setBusy(false) }
  }

  async function confirmDeletion() {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleteTarget(null)
    if (target.kind === "elderly") {
      const person = elderly.find((item) => item.id === target.id)
      if (person) await removeElderly(person, true)
      return
    }
    await removeSession(true)
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

  return <section ref={motionRoot} className="elderly-health-manager mx-auto max-w-7xl space-y-5 py-1" aria-labelledby="elderly-health-title">
    <header data-elderly-panel className="relative isolate overflow-hidden rounded-[28px] bg-emerald-800 p-5 text-white shadow-xl sm:p-8"><div data-elderly-orb className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-emerald-300/20 blur-3xl" /><div data-elderly-pulse className="pointer-events-none absolute bottom-3 right-10 size-24 rounded-full border border-white/25" /><div className="relative flex flex-wrap items-start justify-between gap-4"><div><span className="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25"><HeartPulse className="size-6" /></span><p className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-emerald-200"><Sparkles className="size-3.5" />Layanan kesehatan internal</p><h1 id="elderly-health-title" className="mt-1 text-2xl font-black sm:text-3xl">Rekam Medis Lansia & Posyandu</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">Kelola data warga lansia dan pemeriksaan posyandu secara aman. Data ini tidak ditampilkan di website publik.</p></div><Button data-admin-action type="button" variant="secondary" onClick={() => void loadEverything()} disabled={busy}><RefreshCw className={busy ? "animate-spin" : ""} />Muat ulang</Button></div></header>

    <nav data-elderly-panel aria-label="Navigasi modul kesehatan" className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id as "dashboard" | "lansia" | "posyandu" | "akun")} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${activeTab === id ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20" : "text-slate-600 hover:bg-emerald-50"}`}><Icon className="size-4" />{label}</button>)}</nav>

    {activeTab === "lansia" ? <ElderlyPagination pagination={pagination} onPageChange={(nextPage) => setPage(nextPage)} /> : null}

    {activeTab === "dashboard" ? <div className="space-y-5"><section className="rounded-2xl border border-slate-200 bg-white p-4"><div className="grid gap-3 sm:grid-cols-3"><label className="text-xs font-bold text-slate-700">Filter dusun<BrowserlessSelect value={dusunFilter} onChange={(event) => setDusunFilter(event.target.value)} className={inputClass}><option value="">Semua dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</BrowserlessSelect></label><label className="text-xs font-bold text-slate-700">Dari tanggal<LegacyDatePicker value={dateFilter.from} onChange={(event) => setDateFilter((value) => ({ ...value, from: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Sampai tanggal<LegacyDatePicker value={dateFilter.to} onChange={(event) => setDateFilter((value) => ({ ...value, to: event.target.value }))} className={inputClass} /></label></div><div className="mt-3"><Button type="button" size="sm" onClick={() => void loadDashboard()}><BarChart3 />Terapkan filter</Button></div></section><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "Lansia aktif", value: dashboard.metrics.totalElderly, icon: Users }, { label: "Sudah diperiksa", value: dashboard.metrics.checkedElderly, icon: Check }, { label: "Kehadiran", value: `${dashboard.metrics.attendanceRate}%`, icon: Activity }, { label: "Sesi pada periode", value: dashboard.metrics.sessionCount, icon: ClipboardPlus }].map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="size-5" /></span><p className="mt-5 text-2xl font-black text-slate-950">{value}</p><p className="mt-1 text-sm font-semibold text-slate-600">{label}</p></article>)}</div><div className="grid gap-5 xl:grid-cols-2"><ChartCard title="Penyakit aktif terbanyak" empty={!dashboard.diseaseTop.length}><Bar data={diseaseBar} options={{ responsive: true, plugins: { legend: { display: false } } }} /></ChartCard><ChartCard title="Kehadiran per sesi" empty={!dashboard.sessionAttendance.length}><Bar data={attendanceBar} options={{ responsive: true, plugins: { legend: { display: false } } }} /></ChartCard></div><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-black text-slate-900">Tren pengukuran bulanan</h2><BrowserlessSelect value={trendMetric} onChange={(event) => setTrendMetric(event.target.value as typeof trendMetric)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700">{["systolic", "diastolic", "weightKg", "heightCm", "bloodGlucoseMgDl"].map((metric) => <option key={metric} value={metric}>{metricLabel(metric)}</option>)}</BrowserlessSelect></div>{dashboard.measurementTrend.length ? <div className="mt-5 h-72"><Line data={trendLine} options={{ responsive: true, maintainAspectRatio: false }} /></div> : <EmptyChart />}</article><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black text-slate-900">Sebaran penyakit aktif per dusun</h2>{dashboard.diseaseDusun.length ? <div className="mt-4 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Penyakit</th>{hamlets.map((hamlet) => <th key={hamlet} className="px-3 py-2">{hamlet.replace("Dusun ", "")}</th>)}<th className="px-3 py-2">Total</th></tr></thead><tbody>{dashboard.diseaseDusun.map((item) => <tr key={item.disease} className="border-b border-slate-100"><td className="px-3 py-3 font-bold text-slate-800">{item.disease}</td>{hamlets.map((hamlet) => <td key={hamlet} className="px-3 py-3">{item.dusun[hamlet] ?? 0}</td>)}<td className="px-3 py-3 font-bold">{item.total}</td></tr>)}</tbody></table></div> : <EmptyChart />}</article></div> : null}

    {activeTab === "lansia" ? <div className="space-y-5"><form onSubmit={saveElderly} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-black text-slate-900">{editingElderlyId ? "Ubah data lansia" : "Tambah lansia"}</h2><p className="mt-1 text-sm text-slate-600">Penyakit dapat ditulis bebas dan dipisahkan dengan koma.</p></div>{editingElderlyId ? <Button type="button" variant="outline" onClick={() => { setEditingElderlyId(null); setElderlyForm(blankElderly()) }}>Batal</Button> : null}</div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="text-xs font-bold text-slate-700">Nama lengkap<input required value={elderlyForm.fullName} onChange={(event) => setElderlyForm((value) => ({ ...value, fullName: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Dusun<BrowserlessSelect required value={elderlyForm.dusun} onChange={(event) => setElderlyForm((value) => ({ ...value, dusun: event.target.value }))} className={inputClass}><option value="">Pilih dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</BrowserlessSelect></label><label className="text-xs font-bold text-slate-700">Tanggal lahir<LegacyDatePicker required value={elderlyForm.birthDate} onChange={(event) => setElderlyForm((value) => ({ ...value, birthDate: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Status<BrowserlessSelect value={elderlyForm.isActive ? "active" : "inactive"} onChange={(event) => setElderlyForm((value) => ({ ...value, isActive: event.target.value === "active" }))} className={inputClass}><option value="active">Aktif</option><option value="inactive">Nonaktif</option></BrowserlessSelect></label><label className="text-xs font-bold text-slate-700 sm:col-span-2">Alamat<input required value={elderlyForm.address} onChange={(event) => setElderlyForm((value) => ({ ...value, address: event.target.value }))} className={inputClass} /></label><label className="text-xs font-bold text-slate-700 sm:col-span-2">Penyakit aktif<input value={elderlyForm.diseases} onChange={(event) => setElderlyForm((value) => ({ ...value, diseases: event.target.value }))} placeholder="Contoh: Hipertensi, Diabetes" className={inputClass} /></label></div><div className="mt-4"><Button type="submit" disabled={busy}>{editingElderlyId ? <Save /> : <Plus />}{editingElderlyId ? "Simpan perubahan" : "Simpan lansia"}</Button></div></form><section className="rounded-2xl border border-slate-200 bg-white p-4"><div className="grid gap-3 sm:grid-cols-[1fr_220px_auto]"><label className="relative"><span className="sr-only">Cari lansia</span><Search className="absolute left-3 top-3 size-5 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama lansia" className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-emerald-600" /></label><BrowserlessSelect value={dusunFilter} onChange={(event) => setDusunFilter(event.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700"><option value="">Semua dusun</option>{hamlets.map((item) => <option key={item}>{item}</option>)}</BrowserlessSelect><Button type="button" onClick={() => void loadElderly()}><Search />Cari</Button></div></section><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{elderly.map((person) => <article key={person.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${person.isActive ? "border-slate-200" : "border-slate-300 opacity-70"}`}><div className="flex items-start justify-between gap-3"><div><h2 className="font-black text-slate-900">{person.fullName}</h2><p className="mt-1 text-sm text-slate-500">{person.dusun} · {age(person.birthDate)} tahun</p></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => editElderly(person)}><Edit3 />Ubah</Button>{canManageAccounts ? <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => void removeElderly(person)} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 />Hapus</Button> : null}</div></div><p className="mt-4 text-sm leading-6 text-slate-600">{person.address}</p><div className="mt-4 flex flex-wrap gap-2">{person.diseases.length ? person.diseases.map((disease) => <span key={disease.id} className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">{disease.diseaseName}</span>) : <span className="text-xs font-semibold text-slate-400">Tidak ada penyakit aktif tercatat</span>}</div>{person.diseaseHistory.some((disease) => disease.endedAt) ? <details className="mt-4 text-xs"><summary className="cursor-pointer font-bold text-slate-600">Riwayat penyakit</summary><ul className="mt-2 space-y-1 text-slate-500">{person.diseaseHistory.filter((disease) => disease.endedAt).map((disease) => <li key={disease.id}>{disease.diseaseName} · berakhir {dateLabel(disease.endedAt!)}</li>)}</ul></details> : null}{!person.isActive ? <p className="mt-4 text-xs font-bold text-slate-500">Profil nonaktif</p> : null}</article>)}{!elderly.length ? <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">Belum ada data lansia yang sesuai.</p> : null}</div></div> : null}

    {activeTab === "posyandu" ? <div className="space-y-5"><form onSubmit={saveSession} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5"><h2 className="font-black text-slate-900">Buat sesi posyandu</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><label className="text-xs font-bold text-slate-700 sm:col-span-2">Nama sesi<input required value={sessionForm.name} onChange={(event) => setSessionForm((value) => ({ ...value, name: event.target.value }))} placeholder="Contoh: Posyandu Lansia Balai Desa" className={inputClass} /></label><label className="text-xs font-bold text-slate-700">Tanggal sesi<LegacyDatePicker required value={sessionForm.sessionDate} onChange={(event) => setSessionForm((value) => ({ ...value, sessionDate: event.target.value }))} className={inputClass} /></label></div><div className="mt-4"><Button type="submit" disabled={busy}><Plus />Buat sesi</Button></div></form><section className="rounded-2xl border border-slate-200 bg-white p-4"><label className="text-xs font-bold text-slate-700">Sesi aktif<BrowserlessSelect value={selectedSessionId} onChange={(event) => setSelectedSessionId(event.target.value)} className={inputClass}><option value="">Pilih sesi posyandu</option>{sessions.map((session) => <option key={session.id} value={session.id}>{dateLabel(session.sessionDate)} — {session.name} ({session._count.checks} diperiksa)</option>)}</BrowserlessSelect></label></section>{selectedSession ? <><header className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-black text-slate-950">Kartu digital: {selectedSession.name}</h2><p className="mt-1 text-sm text-slate-600">{dateLabel(selectedSession.sessionDate)} · sentuh tombol pemeriksaan untuk mencentang warga dan menyimpan hasilnya.</p></div>{canManageAccounts ? <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => void removeSession()} className="text-red-700 hover:bg-red-50 hover:text-red-800"><Trash2 />Hapus sesi</Button> : null}</header><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{activeElderly.map((person) => { const checked = person.checks?.[0]; const editing = checkingElderlyId === person.id; return <article key={person.id} className={`rounded-2xl border p-5 shadow-sm ${checked ? "border-emerald-300 bg-emerald-50/40" : "border-slate-200 bg-white"}`}><div className="flex items-start justify-between gap-3"><div><h3 className="font-black text-slate-900">{person.fullName}</h3><p className="mt-1 text-sm text-slate-500">{person.dusun} · {age(person.birthDate)} tahun</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-black ${checked ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>{checked ? "Sudah diperiksa" : "Belum diperiksa"}</span></div><div className="mt-3 flex flex-wrap gap-1.5">{person.diseases.map((disease) => <span key={disease.id} className="rounded-full bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">{disease.diseaseName}</span>)}</div>{checked ? <p className="mt-4 text-xs leading-5 text-emerald-900">TD {checked.systolic}/{checked.diastolic} · BB {checked.weightKg} kg · TB {checked.heightCm} cm · Gula {checked.bloodGlucoseMgDl} mg/dL</p> : null}<div className="mt-4"><Button type="button" size="sm" onClick={() => openCheck(person)}><Check />{checked ? "Ubah hasil" : "Centang pemeriksaan"}</Button></div>{editing ? <form onSubmit={saveCheck} className="mt-4 rounded-xl border border-emerald-200 bg-white p-3"><div className="grid grid-cols-2 gap-2"><SmallInput label="Sistolik" value={checkForm.systolic} onChange={(value) => setCheckForm((state) => ({ ...state, systolic: value }))} /><SmallInput label="Diastolik" value={checkForm.diastolic} onChange={(value) => setCheckForm((state) => ({ ...state, diastolic: value }))} /><SmallInput label="Berat (kg)" value={checkForm.weightKg} onChange={(value) => setCheckForm((state) => ({ ...state, weightKg: value }))} /><SmallInput label="Tinggi (cm)" value={checkForm.heightCm} onChange={(value) => setCheckForm((state) => ({ ...state, heightCm: value }))} /><SmallInput label="Gula (mg/dL)" value={checkForm.bloodGlucoseMgDl} onChange={(value) => setCheckForm((state) => ({ ...state, bloodGlucoseMgDl: value }))} /></div><label className="mt-2 block text-xs font-bold text-slate-700">Catatan<textarea value={checkForm.notes} onChange={(event) => setCheckForm((state) => ({ ...state, notes: event.target.value }))} className="mt-1 min-h-16 w-full rounded-lg border border-slate-200 p-2 text-sm" /></label><div className="mt-3 flex gap-2"><Button type="submit" size="sm" disabled={busy}><Save />Simpan</Button><Button type="button" size="sm" variant="ghost" onClick={() => setCheckingElderlyId(null)}>Batal</Button></div></form> : null}</article> })}</div></> : <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">Buat atau pilih sesi posyandu untuk menampilkan kartu digital.</p>}</div> : null}

    <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
      <DialogContent className="max-w-md px-4 sm:px-0">
        <div ref={deleteDialogRef} data-elderly-solid-surface className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-2xl">
          <div className="relative overflow-hidden bg-rose-700 p-6 text-white">
            <div className="absolute -right-6 -top-8 size-28 rounded-full bg-white/10 blur-xl" />
            <span data-delete-dialog-item className="relative grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25"><AlertTriangle className="size-6" /></span>
            <DialogTitle data-delete-dialog-item className="relative mt-5 text-xl font-black">Hapus data secara permanen?</DialogTitle>
          </div>
          <div className="p-6">
            <DialogDescription data-delete-dialog-item className="text-sm leading-6 text-slate-600">{deleteTarget?.kind === "elderly" ? `Data ${deleteTarget.name}, riwayat penyakit, dan pemeriksaannya akan dihapus.` : `Sesi ${deleteTarget?.name ?? ""} beserta seluruh hasil pemeriksaannya akan dihapus.`} Tindakan ini tidak dapat dibatalkan.</DialogDescription>
            <div data-delete-dialog-item className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => setDeleteTarget(null)} disabled={busy}>Batal</Button><Button type="button" className="bg-rose-700 hover:bg-rose-800" onClick={() => void confirmDeletion()} disabled={busy}><Trash2 />{busy ? "Menghapus..." : "Ya, hapus permanen"}</Button></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <Dialog open={Boolean(toast)} onOpenChange={(open) => !open && setToast(null)}>
      <DialogContent className="max-w-sm px-4 sm:px-0">
        <div ref={noticeDialogRef} data-elderly-solid-surface className={`overflow-hidden rounded-3xl border bg-white shadow-2xl ${toast?.variant === "error" ? "border-rose-100" : "border-emerald-100"}`}>
          <div className={`p-6 text-white ${toast?.variant === "error" ? "bg-rose-700" : "bg-emerald-800"}`}>
            <span data-notice-dialog-item className="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">{toast?.variant === "error" ? <AlertTriangle className="size-6" /> : <Check className="size-6" />}</span>
            <DialogTitle data-notice-dialog-item className="mt-5 text-xl font-black">{toast?.variant === "error" ? "Tindakan belum berhasil" : "Berhasil disimpan"}</DialogTitle>
          </div>
          <div className="p-6"><DialogDescription data-notice-dialog-item className="text-sm leading-6 text-slate-600">{toast?.message}</DialogDescription><div data-notice-dialog-item className="mt-6 flex justify-end"><Button type="button" onClick={() => setToast(null)}>Mengerti</Button></div></div>
        </div>
      </DialogContent>
    </Dialog>
  </section>
}

function SmallInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <Label className="text-[11px]">{label}<Input required min="0.01" inputMode="decimal" type="number" step="any" value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-9 rounded-lg bg-white px-2" /></Label> }
function EmptyChart() { return <p className="grid h-56 place-items-center text-center text-sm text-slate-500">Belum ada data yang cukup untuk ditampilkan.</p> }
function ChartCard({ title, empty, children }: { title: string; empty: boolean; children: React.ReactNode }) { return <Card data-elderly-card><CardHeader><CardTitle className="font-black text-slate-900">{title}</CardTitle><CardDescription>Ringkasan berdasarkan data pemeriksaan tersimpan.</CardDescription></CardHeader><CardContent><div className="h-72">{empty ? <EmptyChart /> : children}</div></CardContent></Card> }
