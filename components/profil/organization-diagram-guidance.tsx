import { HugeiconsIcon } from "@hugeicons/react"
import EyeIcon from "@hugeicons/core-free-icons/EyeIcon"
import HierarchyIcon from "@hugeicons/core-free-icons/HierarchyIcon"
import Maximize01Icon from "@hugeicons/core-free-icons/Maximize01Icon"

interface OrganizationDiagramGuidanceProps {
  coordinationLabel: string
  detailLabel: string
}

export function OrganizationDiagramBadges({ coordinationLabel, detailLabel }: OrganizationDiagramGuidanceProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Informasi bagan">
      <span className="structure-stat inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800"><HugeiconsIcon icon={HierarchyIcon} strokeWidth={1.8} className="h-3.5 w-3.5" aria-hidden="true" />{coordinationLabel}</span>
      <span className="structure-stat inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700"><HugeiconsIcon icon={EyeIcon} strokeWidth={1.8} className="h-3.5 w-3.5" aria-hidden="true" />{detailLabel}</span>
    </div>
  )
}

export function OrganizationDiagramLegend() {
  return <aside aria-label="Panduan membaca bagan" className="structure-legend mt-4 grid gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-600 sm:grid-cols-2 sm:rounded-2xl sm:p-4"><p className="flex min-w-0 items-center gap-2.5"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-emerald-700 shadow-sm"><HugeiconsIcon icon={HierarchyIcon} strokeWidth={1.8} className="h-4 w-4" aria-hidden="true" /></span><span className="min-w-0 break-words">Bagan menampilkan hubungan kerja dan jalur koordinasi perangkat desa.</span></p><p className="flex min-w-0 items-center gap-2.5"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-emerald-700 shadow-sm"><HugeiconsIcon icon={Maximize01Icon} strokeWidth={1.8} className="h-4 w-4" aria-hidden="true" /></span><span className="min-w-0 break-words">Gunakan tampilan penuh untuk membaca detail dengan lebih nyaman.</span></p></aside>
}
