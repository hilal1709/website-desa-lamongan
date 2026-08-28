import { fieldLabels, itemLabels } from "@/components/admin/cms-page-editor-data"
import type { CmsField, CmsItemField } from "@/components/admin/cms-page-editor-types"

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-700 focus:bg-white"

export function CmsPageTextField({ field, value, onChange }: { field: CmsField | CmsItemField; value: string; onChange: (value: string) => void }) {
  const multiline = field === "description"
  const label = field in fieldLabels ? fieldLabels[field as CmsField] : itemLabels[field as CmsItemField]
  return <label className={`text-sm font-bold text-slate-700 ${multiline ? "md:col-span-2" : ""}`}><span>{label}</span>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className={inputClass} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />}</label>
}
