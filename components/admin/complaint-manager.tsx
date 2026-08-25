"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Eye, LoaderCircle, Save, Search, Trash2 } from "lucide-react"

import { COMPLAINT_STATUSES, type ComplaintStatus } from "@/lib/complaint-status"

type Complaint = { id: string; title: string; category: string; location: string; contact: string; description: string; status: ComplaintStatus; publicResponse: string | null; createdAt: string; updatedAt: string; respondedAt: string | null }
const field = "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" })

export function ComplaintManager() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [status, setStatus] = useState<ComplaintStatus>("Baru")
  const [response, setResponse] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set("search", search.trim())
      if (statusFilter) params.set("status", statusFilter)
      if (categoryFilter) params.set("category", categoryFilter)
      const result = await fetch(`/api/cms/aduan?${params.toString()}`)
      const payload = await result.json() as { complaints?: Complaint[]; message?: string }
      if (!result.ok) throw new Error(payload.message ?? "Aduan tidak dapat dimuat.")
      setComplaints(payload.complaints ?? [])
    } catch (error) { setMessage(error instanceof Error ? error.message : "Aduan tidak dapat dimuat.") } finally { setLoading(false) }
  }, [categoryFilter, search, statusFilter])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])
  const categories = useMemo(() => [...new Set(complaints.map((item) => item.category))].sort(), [complaints])
  const counts = useMemo(() => Object.fromEntries(COMPLAINT_STATUSES.map((item) => [item, complaints.filter((complaint) => complaint.status === item).length])) as Record<ComplaintStatus, number>, [complaints])
  const select = (item: Complaint) => { setSelected(item); setStatus(item.status); setResponse(item.publicResponse ?? ""); setMessage("") }

  const save = async () => {
    if (!selected) return
    setSaving(true); setMessage("")
    try {
      const result = await fetch(`/api/cms/aduan/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, response }) })
      const payload = await result.json() as { complaint?: Complaint; message?: string }
      if (!result.ok || !payload.complaint) throw new Error(payload.message ?? "Aduan tidak dapat diperbarui.")
      setSelected(payload.complaint); setMessage("Aduan berhasil diperbarui."); await load()
    } catch (error) { setMessage(error instanceof Error ? error.message : "Aduan tidak dapat diperbarui.") } finally { setSaving(false) }
  }

  const remove = async () => {
    if (!selected || !window.confirm("Hapus aduan ini secara permanen? Data yang dihapus tidak dapat dipulihkan.")) return
    setSaving(true); setMessage("")
    try {
      const result = await fetch(`/api/cms/aduan/${selected.id}`, { method: "DELETE" })
      const payload = await result.json() as { message?: string }
      if (!result.ok) throw new Error(payload.message ?? "Aduan tidak dapat dihapus.")
      setSelected(null); setMessage("Aduan berhasil dihapus."); await load()
    } catch (error) { setMessage(error instanceof Error ? error.message : "Aduan tidak dapat dihapus.") } finally { setSaving(false) }
  }

  return <div className="space-y-5"><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{COMPLAINT_STATUSES.map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm font-bold text-slate-500">{item}</p><p className="mt-1 text-3xl font-black text-slate-950">{counts[item]}</p></div>)}</section><section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 lg:flex-row"><label className="relative min-w-0 flex-1"><span className="sr-only">Cari aduan</span><Search className="pointer-events-none absolute left-3 top-4 size-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void load() }} placeholder="Cari judul, lokasi, atau kontak" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">Semua status</option>{COMPLAINT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="">Semua kategori</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><button onClick={() => void load()} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Cari</button></div><div className="mt-5 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-3">Aduan</th><th className="px-3 py-3">Kategori / lokasi</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Tanggal</th><th className="px-3 py-3"><span className="sr-only">Aksi</span></th></tr></thead><tbody>{loading ? <tr><td colSpan={5} className="p-8 text-center text-slate-500"><LoaderCircle className="mx-auto size-5 animate-spin" /></td></tr> : complaints.length ? complaints.map((item) => <tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="px-3 py-4 font-bold text-slate-950">{item.title}</td><td className="px-3 py-4 text-slate-600">{item.category}<br />{item.location}</td><td className="px-3 py-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">{item.status}</span></td><td className="px-3 py-4 text-slate-600">{dateFormatter.format(new Date(item.createdAt))}</td><td className="px-3 py-4"><button onClick={() => select(item)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50"><Eye className="size-4" />Detail</button></td></tr>) : <tr><td colSpan={5} className="p-8 text-center text-slate-500">Tidak ada aduan yang cocok.</td></tr>}</tbody></table></div></section>{selected ? <section className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Detail aduan</p><h2 className="mt-1 text-xl font-black text-slate-950">{selected.title}</h2></div><button onClick={() => setSelected(null)} className="text-sm font-bold text-slate-500">Tutup</button></div><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4 text-sm"><p><b>Kategori:</b> {selected.category}</p><p className="mt-2"><b>Lokasi:</b> {selected.location}</p><p className="mt-2"><b>Kontak:</b> {selected.contact}</p><p className="mt-2"><b>Dikirim:</b> {dateFormatter.format(new Date(selected.createdAt))}</p></div><div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6"><b className="text-slate-950">Isi laporan</b><p className="mt-2 whitespace-pre-wrap text-slate-700">{selected.description}</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-bold text-slate-700">Status<select value={status} onChange={(event) => setStatus(event.target.value as ComplaintStatus)} className={field}>{COMPLAINT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-bold text-slate-700">Tanggapan untuk publik<textarea value={response} onChange={(event) => setResponse(event.target.value)} rows={4} maxLength={2000} placeholder="Tulis tindak lanjut yang dapat dilihat warga." className={field} /></label></div><div className="mt-5 flex flex-wrap items-center gap-3"><button disabled={saving} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save className="size-4" />{saving ? "Menyimpan..." : "Simpan tindak lanjut"}</button><button disabled={saving} onClick={() => void remove()} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-60"><Trash2 className="size-4" />Hapus permanen</button></div></section> : null}{message ? <p className="text-sm font-bold text-emerald-700">{message}</p> : null}</div>
}
