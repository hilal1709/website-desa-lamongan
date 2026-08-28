import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete01Icon } from "@hugeicons/core-free-icons"
import { CmsImageUpload } from "@/components/admin/cms-image-upload"
import { CmsPageTextField } from "@/components/admin/cms-page-text-field"
import type { CmsSectionSettings } from "@/components/admin/cms-page-editor-types"
import type { CmsPageContent } from "@/lib/cms-pages"
import { Button } from "@/components/ui/button"

const Plus = () => <HugeiconsIcon icon={Add01Icon} aria-hidden="true" />
const Trash = () => <HugeiconsIcon icon={Delete01Icon} className="size-3.5" aria-hidden="true" />

type Props = {
  section: CmsPageContent["sections"][number]
  settings: CmsSectionSettings
  onChange: (field: CmsSectionSettings["fields"][number], value: string) => void
  onItemChange: (index: number, field: NonNullable<CmsSectionSettings["itemFields"]>[number], value: string) => void
  onAddItem: () => void
  onRemoveItem: (index: number) => void
}

export function CmsPageSectionEditor({ section, settings, onChange, onItemChange, onAddItem, onRemoveItem }: Props) {
  const managesMission = section.key === "vision-mission"
  const itemFields = settings.itemFields ?? []

  return <section data-cms-section aria-labelledby={`cms-section-${section.key}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <header><h3 id={`cms-section-${section.key}`} className="font-black text-slate-950">{settings.label}</h3><p className="mt-1 text-sm text-slate-500">Bagian ini tampil di halaman publik.</p></header>
    <div className="mt-4 grid gap-4 md:grid-cols-2">{settings.fields.map((field) => <CmsPageTextField key={field} field={field} value={((section as Record<string, unknown>)[field] as string | undefined) ?? ""} onChange={(value) => onChange(field, value)} />)}</div>
    {settings.fields.includes("image") ? <div className="mt-4"><CmsImageUpload onUploaded={(url) => onChange("image", url)} /></div> : null}
    {itemFields.length && section.items?.length ? <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">{section.items.map((item, index) => <article key={`${section.key}-${index}`} className="rounded-xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[.14em] text-slate-500">{managesMission ? `Misi ${index + 1}` : `Item ${index + 1}`}</p>{managesMission ? <button type="button" onClick={() => onRemoveItem(index)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash />Hapus</button> : null}</div><div className="mt-3 grid gap-3 md:grid-cols-2">{itemFields.map((field) => <CmsPageTextField key={field} field={field} value={(item[field] as string | undefined) ?? ""} onChange={(value) => onItemChange(index, field, value)} />)}</div></article>)}</div> : null}
    {managesMission ? <Button type="button" variant="outline" onClick={onAddItem} className="mt-4"><Plus />Tambah misi</Button> : null}
  </section>
}
