"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { PaginationControls } from "@/components/ui/pagination-controls"

type Row = { id: string; actorId: string | null; action: string; resource: string; targetId: string | null; ipHash: string | null; createdAt: string }

export function AuditLogTable({ rows, page, total, pageSize }: { rows: Row[]; page: number; total: number; pageSize: number }) {
  const [selected, setSelected] = useState<Row | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const router = useRouter()
  useEffect(() => { if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; let ctx: { revert: () => void } | undefined; void import("gsap").then(({ default: gsap }) => { ctx = gsap.context(() => gsap.fromTo("[data-audit-row]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: .035, duration: .35, ease: "power2.out" }), root) }); return () => ctx?.revert() }, [rows])
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return <div ref={root} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div><h2 className="text-lg font-black text-slate-950">Aktivitas tercatat</h2><p className="mt-1 text-sm text-slate-500">{total} aktivitas · IP disimpan sebagai hash.</p></div>
      <ShieldAlert className="size-6 text-emerald-700" aria-hidden="true" />
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <caption className="sr-only">Daftar aktivitas keamanan CMS</caption>
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Waktu</th><th className="px-4 py-3">Aktivitas</th><th className="px-4 py-3">Resource</th><th className="px-4 py-3"><span className="sr-only">Detail</span></th></tr></thead>
        <tbody className="divide-y divide-slate-100">{rows.map((row) => <tr data-audit-row key={row.id} className="text-slate-700 hover:bg-slate-50"><td className="whitespace-nowrap px-4 py-3">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.createdAt))}</td><td className="px-4 py-3 font-bold text-slate-900">{row.action}</td><td className="px-4 py-3">{row.resource}</td><td className="px-4 py-3 text-right"><Button variant="outline" size="sm" onClick={() => setSelected(row)}><Eye />Detail</Button></td></tr>)}{!rows.length ? <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-500">Belum ada aktivitas yang tercatat.</td></tr> : null}</tbody>
      </table>
    </div>
    <PaginationControls page={page} totalPages={totalPages} totalItems={total} pageSize={pageSize} itemLabel="aktivitas" onPageChange={(nextPage) => router.push(`/admin/audit-log?page=${nextPage}`)} />
    <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-w-md px-4 sm:px-0"><div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-2xl sm:p-6"><DialogTitle className="text-xl font-black text-slate-950">Detail aktivitas</DialogTitle><DialogDescription className="mt-2">Informasi teknis terbatas untuk superadmin.</DialogDescription><dl className="mt-5 grid gap-3 text-sm"><div><dt className="font-bold text-slate-500">Aktivitas</dt><dd>{selected?.action}</dd></div><div><dt className="font-bold text-slate-500">Resource</dt><dd>{selected?.resource}</dd></div><div><dt className="font-bold text-slate-500">Pelaku</dt><dd className="break-all">{selected?.actorId ?? "Tidak tersedia"}</dd></div><div><dt className="font-bold text-slate-500">Waktu</dt><dd>{selected && new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "medium" }).format(new Date(selected.createdAt))}</dd></div></dl><div className="mt-6 flex justify-end"><Button onClick={() => setSelected(null)}>Tutup</Button></div></div></DialogContent></Dialog>
  </div>
}
