"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Activity01Icon from "@hugeicons/core-free-icons/Activity01Icon"
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon"
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon"
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon"
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon"
import ShieldAlertIcon from "@hugeicons/core-free-icons/ShieldAlertIcon"
import ShieldCheckIcon from "@hugeicons/core-free-icons/ShieldCheckIcon"
import UserIcon from "@hugeicons/core-free-icons/UserIcon"
import ViewIcon from "@hugeicons/core-free-icons/ViewIcon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AuditDetail, AuditEmptyState, AuditIcon } from "@/components/admin/audit-log/audit-log-primitives"
import { auditDateTime as dateTime, auditFullDateTime as fullDateTime, getAuditActionTone as actionTone, getAuditActorLabel as shortId } from "@/components/admin/audit-log/audit-log-utils"
import type { AuditLogTableProps, AuditLogRow as Row } from "@/components/admin/audit-log/types"

const Icon = AuditIcon

export function AuditLogTable({ rows, page, total, pageSize }: AuditLogTableProps) {
  const [selected, setSelected] = useState<Row | null>(null)
  const [query, setQuery] = useState("")
  const [resource, setResource] = useState("all")
  const root = useRef<HTMLDivElement>(null)
  const dialogCard = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const resources = useMemo(() => [...new Set(rows.map((row) => row.resource))].sort(), [rows])
  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return rows.filter((row) => (resource === "all" || row.resource === resource) && (!keyword || [row.action, row.resource, row.actorId, row.targetId].filter(Boolean).join(" ").toLowerCase().includes(keyword)))
  }, [query, resource, rows])
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const statistics = [
    { label: "Total aktivitas", value: total, hint: "Seluruh catatan", icon: Activity01Icon, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Di halaman ini", value: rows.length, hint: `Halaman ${page} dari ${totalPages}`, icon: Calendar01Icon, tone: "bg-sky-50 text-sky-700" },
    { label: "Pelaku unik", value: new Set(rows.map((row) => row.actorId).filter(Boolean)).size, hint: `${rows.filter((row) => !row.actorId).length} aktivitas sistem`, icon: UserIcon, tone: "bg-violet-50 text-violet-700" },
  ]

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-audit-intro]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.52 })
          .fromTo("[data-audit-stat]", { autoAlpha: 0, y: 16, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.07, ease: "back.out(1.5)" }, "-=.28")
          .fromTo("[data-audit-panel]", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.52 }, "-=.18")
        gsap.to("[data-audit-orb]", { x: 18, y: 12, scale: 1.1, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, root)
    })
    return () => context?.revert()
  }, [])

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (root.current) context = gsap.context(() => gsap.fromTo("[data-audit-row]", { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, stagger: 0.035, duration: 0.32, ease: "power2.out", overwrite: "auto" }), root)
    })
    return () => context?.revert()
  }, [filteredRows])

  useEffect(() => {
    if (!selected || !dialogCard.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (dialogCard.current) context = gsap.context(() => gsap.fromTo(dialogCard.current, { autoAlpha: 0, y: 18, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.35)" }))
    })
    return () => context?.revert()
  }, [selected])

  const empty = !filteredRows.length
  const resetFilters = () => { setQuery(""); setResource("all") }

  return <div ref={root} className="space-y-4 sm:space-y-5">
    <Card data-audit-intro className="relative overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 shadow-sm">
      <div data-audit-orb className="pointer-events-none absolute -right-12 -top-14 size-44 rounded-full bg-emerald-300/30 blur-2xl" />
      <CardHeader className="relative p-4 sm:p-6"><div className="flex items-start justify-between gap-3 sm:gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-emerald-700">Pusat pengawasan</p><CardTitle className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">Jejak aktivitas CMS</CardTitle><CardDescription className="mt-2 max-w-2xl text-sm leading-6">Pantau perubahan penting dengan catatan yang aman. Alamat IP hanya dicatat sebagai hash.</CardDescription></div><div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 sm:size-12"><Icon icon={ShieldCheckIcon} className="size-5 sm:size-6" /></div></div></CardHeader>
    </Card>
    <section aria-label="Ringkasan audit" className="grid gap-3 sm:grid-cols-3">{statistics.map(({ label, value, hint, icon, tone }) => <Card data-audit-stat key={label} className="border-slate-200/80 shadow-sm"><CardContent className="flex items-center gap-3 p-4 sm:gap-4"><div className={cn("grid size-10 shrink-0 place-items-center rounded-xl sm:size-11", tone)}><Icon icon={icon} className="size-5" /></div><div className="min-w-0"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-0.5 text-xl font-black text-slate-950 sm:text-2xl">{value.toLocaleString("id-ID")}</p><p className="truncate text-xs text-slate-500">{hint}</p></div></CardContent></Card>)}</section>
    <Card data-audit-panel className="overflow-hidden rounded-3xl border-slate-200 shadow-lg shadow-slate-900/[.04]">
      <CardHeader className="gap-4 border-b border-slate-100 p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-lg font-black text-slate-950">Aktivitas tercatat</CardTitle><CardDescription className="mt-1">Menampilkan {filteredRows.length} dari {rows.length} catatan pada halaman ini.</CardDescription></div><Icon icon={ShieldAlertIcon} className="mt-0.5 size-5 shrink-0 text-emerald-700" /></div><div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]"><div className="relative"><Icon icon={Search01Icon} className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari aktivitas, resource, atau ID…" className="h-11 bg-slate-50 pl-10 text-base sm:text-sm" aria-label="Cari catatan audit" /></div><Select value={resource} onValueChange={setResource}><SelectTrigger className="h-11 bg-slate-50 text-base sm:text-sm"><SelectValue placeholder="Semua resource" /></SelectTrigger><SelectContent><SelectItem value="all">Semua resource</SelectItem>{resources.map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select></div></CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 sm:hidden">
          {filteredRows.map((row) => <article data-audit-row key={row.id} className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><span className={cn("inline-flex max-w-[70%] rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset", actionTone(row.action))}>{row.action}</span><time className="shrink-0 text-right text-xs text-slate-500">{dateTime.format(new Date(row.createdAt))}</time></div><div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Icon icon={FileTextIcon} className="size-4 shrink-0 text-slate-400" />{row.resource}</div><div className="flex items-center justify-between gap-3"><span className="truncate font-mono text-xs text-slate-500">{shortId(row.actorId)}</span><Button variant="outline" size="sm" className="shrink-0" onClick={() => setSelected(row)}><Icon icon={ViewIcon} className="size-4" />Detail</Button></div></article>)}
          {empty ? <AuditEmptyState onReset={resetFilters} /> : null}
        </div>
        <div className="hidden overflow-x-auto sm:block"><table className="min-w-[720px] w-full text-left text-sm"><caption className="sr-only">Daftar aktivitas keamanan CMS</caption><thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-[.14em] text-slate-500"><tr><th className="px-5 py-3.5">Waktu</th><th className="px-5 py-3.5">Aktivitas</th><th className="px-5 py-3.5">Resource</th><th className="px-5 py-3.5">Pelaku</th><th className="px-5 py-3.5"><span className="sr-only">Detail</span></th></tr></thead><tbody className="divide-y divide-slate-100">{filteredRows.map((row) => <tr data-audit-row key={row.id} className="group transition-colors hover:bg-emerald-50/45"><td className="whitespace-nowrap px-5 py-4 text-slate-600">{dateTime.format(new Date(row.createdAt))}</td><td className="px-5 py-4"><span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset", actionTone(row.action))}>{row.action}</span></td><td className="px-5 py-4 font-semibold text-slate-800"><span className="inline-flex items-center gap-2"><AuditIcon icon={FileTextIcon} className="size-4 text-slate-400" />{row.resource}</span></td><td className="px-5 py-4"><span title={row.actorId ?? "Aktivitas sistem"} className="font-mono text-xs text-slate-500">{shortId(row.actorId)}</span></td><td className="px-5 py-4 text-right"><Button variant="ghost" size="sm" className="group-hover:bg-white" onClick={() => setSelected(row)}><AuditIcon icon={ViewIcon} className="size-4" />Detail<AuditIcon icon={ArrowRight01Icon} className="size-3.5" /></Button></td></tr>)}{empty ? <tr><td colSpan={5}><AuditEmptyState onReset={resetFilters} /></td></tr> : null}</tbody></table></div>
      </CardContent>
      <PaginationControls page={page} totalPages={totalPages} totalItems={total} pageSize={pageSize} itemLabel="aktivitas" onPageChange={(nextPage) => router.push(`/admin/audit-log?page=${nextPage}`)} />
    </Card>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-w-md px-4 sm:px-0"><div ref={dialogCard} className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-emerald-100 bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-4"><div><DialogTitle className="text-xl font-black text-slate-950">Detail aktivitas</DialogTitle><DialogDescription className="mt-2">Informasi teknis terbatas untuk superadmin.</DialogDescription></div><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><AuditIcon icon={ShieldCheckIcon} className="size-5" /></div></div><dl className="mt-6 grid gap-3 text-sm"><AuditDetail label="Aktivitas">{selected?.action}</AuditDetail><AuditDetail label="Resource">{selected?.resource}</AuditDetail><div className="grid gap-3 sm:grid-cols-2"><AuditDetail label="Pelaku" mono>{selected?.actorId ?? "Aktivitas sistem"}</AuditDetail><AuditDetail label="Target" mono>{selected?.targetId ?? "Tidak tersedia"}</AuditDetail></div><AuditDetail label="Waktu">{selected && fullDateTime.format(new Date(selected.createdAt))}</AuditDetail></dl><div className="mt-6 flex justify-end"><Button onClick={() => setSelected(null)} className="w-full sm:w-auto">Tutup</Button></div></div></DialogContent></Dialog>
  </div>
}
