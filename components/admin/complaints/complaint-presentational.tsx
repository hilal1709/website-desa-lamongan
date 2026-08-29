import { HugeiconsIcon } from "@hugeicons/react"
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon"
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon"
import MapPinIcon from "@hugeicons/core-free-icons/MapPinIcon"
import ViewIcon from "@hugeicons/core-free-icons/ViewIcon"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import type { ComplaintStatus } from "@/lib/complaint-status"
import type { AdminComplaint } from "./complaint-types"

const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" })
const statusTone: Record<ComplaintStatus, "emerald" | "amber" | "blue" | "rose"> = { Baru: "amber", Diproses: "blue", Selesai: "emerald", Ditutup: "rose" }

export function ComplaintStatusPill({ status }: { status: ComplaintStatus }) {
  return <StatusBadge tone={statusTone[status]}>{status}</StatusBadge>
}

export function ComplaintMobileCard({ item, onOpen }: { item: AdminComplaint; onOpen: (item: AdminComplaint) => void }) {
  return <article data-complaint-row className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><header className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="line-clamp-2 font-bold text-slate-950">{item.title}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</p></div><ComplaintStatusPill status={item.status} /></header><dl className="mt-4 grid gap-2 border-y border-slate-100 py-3 text-xs text-slate-600"><div className="flex items-center gap-2"><HugeiconsIcon icon={FileTextIcon} className="size-3.5 text-emerald-700" /><dt className="sr-only">Kategori</dt><dd>{item.category}</dd></div><div className="flex items-center gap-2"><HugeiconsIcon icon={MapPinIcon} className="size-3.5 text-emerald-700" /><dt className="sr-only">Lokasi</dt><dd>{item.location}</dd></div><div className="flex items-center gap-2"><HugeiconsIcon icon={Calendar01Icon} className="size-3.5 text-emerald-700" /><dt className="sr-only">Dikirim</dt><dd>{dateFormatter.format(new Date(item.createdAt))}</dd></div></dl><Button data-complaint-interactive size="sm" variant="outline" className="mt-3 w-full" onClick={() => onOpen(item)}><HugeiconsIcon icon={ViewIcon} />Tinjau aduan</Button></article>
}

export function ComplaintInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-slate-500"><span className="text-emerald-700">{icon}</span>{label}</p><p className="mt-2 break-words text-sm font-semibold text-slate-800">{value}</p></div>
}
