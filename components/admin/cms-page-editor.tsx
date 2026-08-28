"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, ExternalLinkIcon, FloppyDiskIcon } from "@hugeicons/core-free-icons"
import { CmsImageUpload } from "@/components/admin/cms-image-upload"
import { pageSettings } from "@/components/admin/cms-page-editor-data"
import { CmsPageMotion } from "@/components/admin/cms-page-motion"
import { CmsPageSectionEditor } from "@/components/admin/cms-page-section-editor"
import { CmsPageTextField } from "@/components/admin/cms-page-text-field"
import type { CmsField, CmsItemField } from "@/components/admin/cms-page-editor-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CmsPageContent } from "@/lib/cms-pages"

const ArrowUpRight = () => <HugeiconsIcon icon={ArrowUpRight01Icon} aria-hidden="true" />
const ExternalLink = () => <HugeiconsIcon icon={ExternalLinkIcon} aria-hidden="true" />
const Save = () => <HugeiconsIcon icon={FloppyDiskIcon} aria-hidden="true" />

export function CmsPageEditor({ initialPages }: { initialPages: CmsPageContent[] }) {
  const searchParams = useSearchParams()
  const [pages, setPages] = useState(initialPages)
  const [activeSlug, setActiveSlug] = useState("home")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (initialPages.length) return
    const controller = new AbortController()
    void fetch("/api/cms/pages", { signal: controller.signal }).then((response) => response.json()).then((payload) => { if (!controller.signal.aborted) setPages(payload.pages ?? []) }).catch((error: unknown) => { if ((error as { name?: string }).name !== "AbortError") console.error("CMS pages could not be loaded", error) })
    return () => controller.abort()
  }, [initialPages])

  useEffect(() => { const slug = searchParams.get("halaman"); if (slug && pageSettings.some((item) => item.slug === slug)) setActiveSlug(slug) }, [searchParams])

  const visiblePages = useMemo(() => pageSettings.map((settings) => ({ settings, page: pages.find((page) => page.slug === settings.slug) })).filter((item): item is { settings: typeof pageSettings[number]; page: CmsPageContent } => Boolean(item.page)), [pages])
  const active = visiblePages.find((item) => item.settings.slug === activeSlug) ?? visiblePages[0]
  const page = active?.page
  const settings = active?.settings

  const updatePage = (field: CmsField, value: string) => setPages((current) => current.map((item) => item.slug === page?.slug ? { ...item, [field]: value } : item))
  const updateSection = (key: string, field: CmsField, value: string) => setPages((current) => current.map((item) => item.slug === page?.slug ? { ...item, sections: item.sections.map((section) => section.key === key ? { ...section, [field]: value } : section) } : item))
  const updateItem = (key: string, index: number, field: CmsItemField, value: string) => setPages((current) => current.map((item) => item.slug === page?.slug ? { ...item, sections: item.sections.map((section) => section.key === key ? { ...section, items: (section.items ?? []).map((entry, entryIndex) => entryIndex === index ? { ...entry, [field]: value } : entry) } : section) } : item))
  const addItem = (key: string) => setPages((current) => current.map((item) => item.slug === page?.slug ? { ...item, sections: item.sections.map((section) => section.key === key ? { ...section, items: [...(section.items ?? []), { title: "Misi baru" }] } : section) } : item))
  const removeItem = (key: string, index: number) => setPages((current) => current.map((item) => item.slug === page?.slug ? { ...item, sections: item.sections.map((section) => section.key === key ? { ...section, items: (section.items ?? []).filter((_, itemIndex) => itemIndex !== index) } : section) } : item))

  const save = async () => {
    setSaving(true); setMessage("")
    try {
      const response = await fetch("/api/cms/pages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pages }) })
      const payload = await response.json()
      setPages(payload.pages ?? pages)
      const nextMessage = response.ok ? "Tampilan halaman berhasil disimpan." : payload.message ?? "Tampilan halaman gagal disimpan."
      setMessage(nextMessage)
      window.dispatchEvent(new CustomEvent("cms:notice", { detail: { message: nextMessage, variant: response.ok ? "success" : "error" } }))
    } catch {
      const nextMessage = "Tampilan halaman gagal disimpan. Coba lagi."
      setMessage(nextMessage)
      window.dispatchEvent(new CustomEvent("cms:notice", { detail: { message: nextMessage, variant: "error" } }))
    } finally { setSaving(false) }
  }

  if (!page || !settings) return <p role="status" className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">Memuat tampilan halaman...</p>

  return <CmsPageMotion><Card id="tampilan-halaman" data-cms-shell className="overflow-hidden rounded-[28px] border-slate-200/90 bg-white/95 shadow-xl shadow-emerald-950/[.06]"><CardContent className="p-5 sm:p-6"><div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]"><nav aria-label="Pilih halaman yang akan diedit"><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Pilih halaman</p><div className="mt-3 space-y-2">{visiblePages.map(({ page: listedPage, settings: listedSettings }) => <button key={listedPage.slug} data-cms-page-option type="button" aria-pressed={listedPage.slug === page.slug} onClick={() => setActiveSlug(listedPage.slug)} className={`w-full rounded-2xl border p-4 text-left transition ${listedPage.slug === page.slug ? "border-emerald-600 bg-emerald-50 shadow-sm" : "border-slate-200 hover:border-emerald-200 hover:bg-slate-50"}`}><span className="block font-black text-slate-950">{listedPage.label}</span><span className="mt-1 block text-xs font-semibold text-emerald-700">{listedSettings.href}</span><span className="mt-2 block text-xs leading-5 text-slate-500">{listedSettings.summary}</span></button>)}</div></nav><main data-cms-panel className="min-w-0"><header className="relative overflow-hidden rounded-2xl bg-slate-950 p-5 text-white"><div data-cms-hero-orb className="absolute -right-10 -top-12 size-40 rounded-full bg-emerald-400/20 blur-2xl" /><div data-cms-hero-orb-secondary className="absolute -bottom-16 right-24 size-36 rounded-full bg-cyan-300/10 blur-2xl" /><div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-300">Tampilan halaman publik</p><h2 className="mt-2 text-2xl font-black">{page.label}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{settings.summary}</p></div><Button asChild data-cms-action className="shrink-0 bg-emerald-400 font-black text-slate-950 hover:bg-emerald-300"><a href={settings.href} target="_blank" rel="noreferrer">Lihat halaman <ExternalLink /></a></Button></div><p className="relative mt-4 border-t border-white/10 pt-3 text-xs text-slate-400">URL publik: <span className="font-bold text-white">{settings.href}</span></p></header>{settings.heroFields ? <section data-cms-section aria-labelledby="cms-hero-title" className="mt-5 overflow-hidden rounded-2xl border border-slate-200"><div className="relative min-h-48 bg-emerald-950 p-5 text-white" style={{ backgroundImage: `linear-gradient(90deg, rgba(4, 24, 18, .86), rgba(4, 24, 18, .45)), url(${page.image})`, backgroundPosition: page.imagePosition, backgroundSize: "cover" }}><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-200">Pratinjau hero</p><p className="mt-4 text-sm font-bold text-emerald-100">{page.eyebrow}</p><h3 className="mt-2 max-w-xl text-2xl font-black">{page.title}</h3><p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">{page.description}</p></div><div className="p-4 sm:p-5"><h3 id="cms-hero-title" className="font-black text-slate-950">Hero halaman</h3><p className="mt-1 text-sm text-slate-500">Perubahan berikut langsung memengaruhi bagian pembuka halaman.</p><div className="mt-4 grid gap-4 md:grid-cols-2">{settings.heroFields.map((field) => <CmsPageTextField key={field} field={field} value={((page as Record<string, unknown>)[field] as string | undefined) ?? ""} onChange={(value) => updatePage(field, value)} />)}</div>{settings.heroFields.includes("image") ? <div className="mt-4"><CmsImageUpload onUploaded={(url) => updatePage("image", url)} /></div> : null}</div></section> : null}{settings.sections?.length ? <div className="mt-5 space-y-5">{settings.sections.map((sectionSettings) => { const section = page.sections.find((item) => item.key === sectionSettings.key); return section ? <CmsPageSectionEditor key={section.key} section={section} settings={sectionSettings} onChange={(field, value) => updateSection(section.key, field, value)} onItemChange={(index, field, value) => updateItem(section.key, index, field, value)} onAddItem={() => addItem(section.key)} onRemoveItem={(index) => removeItem(section.key, index)} /> : null })}</div> : null}{settings.manage ? <aside data-cms-section aria-label="Modul terkait" className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h3 className="font-black text-emerald-950">Konten lain dikelola terpisah</h3><p className="mt-1 text-sm leading-6 text-emerald-900">{settings.manage.description}</p><Button asChild data-cms-action className="mt-4"><Link href={settings.manage.href}>Buka {settings.manage.label} <ArrowUpRight /></Link></Button></aside> : null}<footer className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5"><Button data-cms-action type="button" onClick={save} disabled={saving} className="rounded-2xl bg-slate-950 px-5 hover:bg-slate-800"><Save />{saving ? "Menyimpan..." : "Simpan perubahan"}</Button>{message ? <p role="status" className="text-sm font-semibold text-emerald-700">{message}</p> : null}</footer></main></div></CardContent></Card></CmsPageMotion>
}
