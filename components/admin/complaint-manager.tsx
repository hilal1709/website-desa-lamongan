"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Alert01Icon from "@hugeicons/core-free-icons/Alert01Icon"
import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon"
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import CheckmarkCircle01Icon from "@hugeicons/core-free-icons/CheckmarkCircle01Icon"
import Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon"
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon"
import Loading03Icon from "@hugeicons/core-free-icons/Loading03Icon"
import MapPinIcon from "@hugeicons/core-free-icons/MapPinIcon"
import MessageCircleMoreIcon from "@hugeicons/core-free-icons/MessageCircleMoreIcon"
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon"
import SendIcon from "@hugeicons/core-free-icons/SendIcon"
import UserIcon from "@hugeicons/core-free-icons/UserIcon"
import ViewIcon from "@hugeicons/core-free-icons/ViewIcon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { COMPLAINT_STATUSES, type ComplaintStatus } from "@/lib/complaint-status"
import { ComplaintInfo, ComplaintMobileCard, ComplaintStatusPill } from "@/components/admin/complaints/complaint-presentational"
import type { AdminComplaint as Complaint, ComplaintPagination as Pagination, ComplaintResponse } from "@/components/admin/complaints/complaint-types"

const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" })
const responseCache = new Map<string, { expiresAt: number; data: ComplaintResponse }>()
const RESPONSE_CACHE_TTL = 30_000

export function ComplaintManager({ initialComplaints, initialPagination, initialStatusCounts }: { initialComplaints: Complaint[]; initialPagination: Pagination; initialStatusCounts: Record<ComplaintStatus, number> }) {
  const root = useRef<HTMLDivElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const activeRequest = useRef<AbortController | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints)
  const [pagination, setPagination] = useState<Pagination>(initialPagination)
  const [statusCounts, setStatusCounts] = useState<Record<ComplaintStatus, number>>(initialStatusCounts)
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [status, setStatus] = useState<ComplaintStatus>("Baru")
  const [response, setResponse] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  // An empty list is still valid server data; never replace it with a second
  // client request and loading spinner on the first render.
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messageTone, setMessageTone] = useState<"success" | "error">("success")

  const notify = (nextMessage: string, tone: "success" | "error" = "success") => { setMessageTone(tone); setMessage(nextMessage) }

  const load = useCallback(async (nextPage: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set("search", search.trim())
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      params.set("page", String(nextPage))
      params.set("pageSize", String(pagination.pageSize))
      const cacheKey = params.toString()
      const cached = responseCache.get(cacheKey)
      activeRequest.current?.abort()
      let payload: ComplaintResponse
      if (cached && cached.expiresAt > Date.now()) {
        payload = cached.data
      } else {
        const controller = new AbortController()
        activeRequest.current = controller
        const result = await fetch(`/api/cms/aduan?${params}`, { signal: controller.signal })
        payload = await result.json() as ComplaintResponse
        if (!result.ok) throw new Error(payload.message ?? "Aduan tidak dapat dimuat.")
        responseCache.set(cacheKey, { data: payload, expiresAt: Date.now() + RESPONSE_CACHE_TTL })
      }
      setComplaints(payload.complaints ?? [])
      if (payload.pagination) setPagination(payload.pagination)
      if (payload.statusCounts) setStatusCounts(payload.statusCounts)
    } catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; notify(error instanceof Error ? error.message : "Aduan tidak dapat dimuat.", "error") } finally { setLoading(false) }
  }, [categoryFilter, pagination.pageSize, search, statusFilter])

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanups: Array<() => void> = []
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !root.current) return
      context = gsap.context(() => {
        gsap.fromTo("[data-complaint-enter]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.07, ease: "power3.out", clearProps: "transform" })
        gsap.fromTo("[data-complaint-stat]", { autoAlpha: 0, y: 16, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.08, ease: "back.out(1.5)", clearProps: "transform" })
        gsap.fromTo("[data-complaint-row]", { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.32, stagger: 0.035, ease: "power2.out", clearProps: "transform" })
        gsap.utils.toArray<HTMLElement>("[data-complaint-interactive]").forEach((element) => {
          const enter = () => gsap.to(element, { y: -2, duration: 0.18, ease: "power2.out", overwrite: "auto" })
          const leave = () => gsap.to(element, { y: 0, duration: 0.24, ease: "power2.out", overwrite: "auto" })
          element.addEventListener("mouseenter", enter); element.addEventListener("mouseleave", leave)
          cleanups.push(() => { element.removeEventListener("mouseenter", enter); element.removeEventListener("mouseleave", leave) })
        })
      }, root)
    })
    return () => { cancelled = true; cleanups.forEach((cleanup) => cleanup()); context?.revert() }
  }, [complaints.length, loading])

  useEffect(() => {
    if (!deleteConfirmationOpen || !confirmationRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !confirmationRef.current) return
      context = gsap.context(() => {
        gsap.fromTo("[data-delete-confirmation]", { autoAlpha: 0, y: 22, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: "back.out(1.35)" })
        gsap.fromTo("[data-delete-icon]", { rotate: -18, scale: 0.72 }, { rotate: 0, scale: 1, duration: 0.45, ease: "elastic.out(1, 0.5)", delay: 0.08 })
      }, confirmationRef)
    })
    return () => { cancelled = true; context?.revert() }
  }, [deleteConfirmationOpen])

  useEffect(() => {
    if (!message || !notificationRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !notificationRef.current) return
      context = gsap.context(() => gsap.fromTo("[data-complaint-notification]", { autoAlpha: 0, y: 16, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.4)" }), notificationRef)
    })
    return () => { cancelled = true; context?.revert() }
  }, [message])

  const categories = useMemo(() => [...new Set(complaints.map((item) => item.category))].sort(), [complaints])
  const openComplaint = (item: Complaint) => { setSelected(item); setStatus(item.status); setResponse(item.publicResponse ?? ""); setMessage("") }
  const save = async () => {
    if (!selected) return
    setSaving(true); setMessage("")
    try {
      const result = await fetch(`/api/cms/aduan/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, response }) })
      const payload = await result.json() as { complaint?: Complaint; message?: string }
      if (!result.ok || !payload.complaint) throw new Error(payload.message ?? "Aduan tidak dapat diperbarui.")
      responseCache.clear()
      setSelected(payload.complaint); notify("Tindak lanjut aduan berhasil diperbarui."); await load(pagination.page)
    } catch (error) { notify(error instanceof Error ? error.message : "Aduan tidak dapat diperbarui.", "error") } finally { setSaving(false) }
  }
  const remove = async () => {
    if (!selected) return
    setSaving(true); setMessage("")
    try { const result = await fetch(`/api/cms/aduan/${selected.id}`, { method: "DELETE" }); const payload = await result.json() as { message?: string }; if (!result.ok) throw new Error(payload.message ?? "Aduan tidak dapat dihapus."); responseCache.clear(); setDeleteConfirmationOpen(false); setSelected(null); notify("Aduan berhasil dihapus."); await load(pagination.page) } catch (error) { notify(error instanceof Error ? error.message : "Aduan tidak dapat dihapus.", "error") } finally { setSaving(false) }
  }

  return <div ref={root} className="space-y-5">
    <section data-complaint-enter className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{COMPLAINT_STATUSES.map((item, index) => <Card key={item} data-complaint-stat data-complaint-interactive className="relative overflow-hidden border-slate-200/90 bg-white/90 shadow-sm"><div className={`absolute inset-x-0 top-0 h-1 ${["bg-amber-400", "bg-sky-500", "bg-emerald-500", "bg-rose-500"][index]}`} /><CardContent className="flex items-end justify-between p-5"><div><p className="text-sm font-semibold text-slate-500">{item}</p><p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{statusCounts[item]}</p></div><div className="grid size-10 place-items-center rounded-2xl bg-slate-100 text-slate-500"><HugeiconsIcon icon={FileTextIcon} className="size-5" /></div></CardContent></Card>)}</section>
    <Card data-complaint-enter className="overflow-hidden border-slate-200/90 shadow-sm"><CardHeader className="border-b border-slate-100 bg-slate-50/70"><CardTitle className="flex items-center gap-2 text-lg"><HugeiconsIcon icon={MessageCircleMoreIcon} className="size-5 text-emerald-700" />Daftar laporan warga</CardTitle><CardDescription>Gunakan filter untuk memprioritaskan laporan yang perlu ditangani.</CardDescription></CardHeader><CardContent className="p-4 sm:p-5"><div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px_auto]"><div className="relative"><HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void load(1) }} placeholder="Cari judul, lokasi, atau kontak" className="pl-11" /></div><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger><SelectValue placeholder="Semua status" /></SelectTrigger><SelectContent><SelectItem value="all">Semua status</SelectItem>{COMPLAINT_STATUSES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectTrigger><SelectValue placeholder="Semua kategori" /></SelectTrigger><SelectContent><SelectItem value="all">Semua kategori</SelectItem>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select><Button data-complaint-interactive onClick={() => void load(1)}><HugeiconsIcon icon={Search01Icon} />Terapkan</Button></div><div className="mt-5 space-y-3 md:hidden">{loading ? <div className="rounded-2xl border border-slate-100 p-8 text-center"><HugeiconsIcon icon={Loading03Icon} className="mx-auto size-5 animate-spin text-emerald-700" /><p className="mt-2 text-sm text-slate-500">Memuat aduan…</p></div> : complaints.length ? complaints.map((item) => <ComplaintMobileCard key={item.id} item={item} onOpen={openComplaint} />) : <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">Tidak ada aduan yang cocok dengan filter ini.</p>}</div><div className="mt-5 hidden overflow-x-auto md:block"><table className="min-w-[720px] w-full text-left text-sm"><thead className="border-y border-slate-100 bg-slate-50/70 text-xs uppercase tracking-[.12em] text-slate-500"><tr><th className="px-4 py-3 font-bold">Aduan</th><th className="px-4 py-3 font-bold">Kategori / lokasi</th><th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold">Dikirim</th><th className="px-4 py-3"><span className="sr-only">Aksi</span></th></tr></thead><tbody>{loading ? <tr><td colSpan={5} className="p-10 text-center"><HugeiconsIcon icon={Loading03Icon} className="mx-auto size-5 animate-spin text-emerald-700" /><p className="mt-2 text-sm text-slate-500">Memuat aduan…</p></td></tr> : complaints.length ? complaints.map((item) => <tr key={item.id} data-complaint-row className="border-b border-slate-100 transition-colors hover:bg-emerald-50/40"><td className="px-4 py-4"><p className="font-bold text-slate-950">{item.title}</p><p className="mt-1 line-clamp-1 max-w-xs text-xs text-slate-500">{item.description}</p></td><td className="px-4 py-4 text-slate-600"><p className="font-medium">{item.category}</p><p className="mt-1 flex items-center gap-1 text-xs"><HugeiconsIcon icon={MapPinIcon} className="size-3" />{item.location}</p></td><td className="px-4 py-4"><ComplaintStatusPill status={item.status} /></td><td className="px-4 py-4 text-slate-600"><span className="flex items-center gap-1.5"><HugeiconsIcon icon={Calendar01Icon} className="size-3.5 text-slate-400" />{dateFormatter.format(new Date(item.createdAt))}</span></td><td className="px-4 py-4 text-right"><Button data-complaint-interactive size="sm" variant="ghost" onClick={() => openComplaint(item)}><HugeiconsIcon icon={ViewIcon} />Tinjau</Button></td></tr>) : <tr><td colSpan={5} className="p-10 text-center text-slate-500">Tidak ada aduan yang cocok dengan filter ini.</td></tr>}</tbody></table></div><PaginationControls page={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.totalItems} pageSize={pagination.pageSize} itemLabel="aduan" onPageChange={(nextPage) => void load(nextPage)} /></CardContent></Card>
    <Dialog open={Boolean(message)} onOpenChange={(open) => { if (!open) setMessage("") }}><DialogContent ref={notificationRef} data-complaint-notification className="w-[calc(100%-2rem)] max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl"><div className={`grid size-12 place-items-center rounded-2xl ${messageTone === "success" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{messageTone === "success" ? <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-6" /> : <HugeiconsIcon icon={AlertCircleIcon} className="size-6" />}</div><DialogTitle className="mt-5 text-xl font-black text-slate-950">{messageTone === "success" ? "Berhasil" : "Terjadi kendala"}</DialogTitle><DialogDescription className="mt-2 leading-6">{message}</DialogDescription><div className="mt-6 flex justify-end"><Button onClick={() => setMessage("")}>Mengerti</Button></div></DialogContent></Dialog>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null) }}><DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-0 shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 p-5 backdrop-blur"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Tindak lanjut aduan</p><DialogTitle className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">{selected?.title}</DialogTitle><DialogDescription className="mt-1">Perbarui status dan jawaban yang akan terlihat oleh warga.</DialogDescription></div><DialogClose asChild><Button size="icon" variant="ghost" aria-label="Tutup detail aduan"><HugeiconsIcon icon={Cancel01Icon} /></Button></DialogClose></div>{selected ? <div className="space-y-5 p-5"><div className="grid gap-3 md:grid-cols-3"><ComplaintInfo icon={<HugeiconsIcon icon={FileTextIcon} />} label="Kategori" value={selected.category} /><ComplaintInfo icon={<HugeiconsIcon icon={MapPinIcon} />} label="Lokasi" value={selected.location} /><ComplaintInfo icon={<HugeiconsIcon icon={UserIcon} />} label="Kontak" value={selected.contact} /></div><Card className="border-slate-100 bg-slate-50/70 shadow-none"><CardContent className="p-4"><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Isi laporan</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{selected.description}</p></CardContent></Card><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Status penanganan</Label><Select value={status} onValueChange={(value) => setStatus(value as ComplaintStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{COMPLAINT_STATUSES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="public-response">Tanggapan untuk publik</Label><Textarea id="public-response" value={response} onChange={(event) => setResponse(event.target.value)} rows={5} maxLength={2000} placeholder="Tulis tindak lanjut yang dapat dilihat warga." /></div></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5"><Button disabled={saving} onClick={() => void save()}><HugeiconsIcon icon={SendIcon} />{saving ? "Menyimpan…" : "Simpan tindak lanjut"}</Button><Button disabled={saving} onClick={() => setDeleteConfirmationOpen(true)} variant="ghost" className="text-rose-700 hover:bg-rose-50 hover:text-rose-800"><HugeiconsIcon icon={Delete02Icon} />Hapus permanen</Button></div></div> : null}</DialogContent></Dialog>
    <Dialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}><DialogContent ref={confirmationRef} data-delete-confirmation className="w-[calc(100%-2rem)] max-w-md rounded-[28px] border border-rose-100 bg-white p-6 shadow-2xl"><div data-delete-icon className="grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-700"><HugeiconsIcon icon={Alert01Icon} className="size-6" /></div><DialogTitle className="mt-5 text-xl font-black text-slate-950">Hapus aduan ini?</DialogTitle><DialogDescription className="mt-2 leading-6">Aduan <span className="font-semibold text-slate-700">{selected?.title}</span> akan dihapus permanen dan tidak dapat dipulihkan.</DialogDescription><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button variant="ghost" onClick={() => setDeleteConfirmationOpen(false)} disabled={saving}>Batal</Button><Button onClick={() => void remove()} disabled={saving} className="bg-rose-700 hover:bg-rose-800"><HugeiconsIcon icon={Delete02Icon} />{saving ? "Menghapus…" : "Ya, hapus aduan"}</Button></div></DialogContent></Dialog>
  </div>
}

