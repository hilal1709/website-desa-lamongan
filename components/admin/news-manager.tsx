"use client"

import dynamic from "next/dynamic"
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"

import { AlertCircle, AlertTriangle, CheckCircle, Clock, FileText, ImageAdd, Pencil, Plus, Save, Search, Send, Tag, Trash, X } from "@/components/admin/news/news-icons"
import { ARTICLES_PER_PAGE, createEmptyArticle, makeNewsSlug } from "@/components/admin/news/news-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { BrowserlessSelect } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CmsNewsArticle, CmsNewsData } from "@/lib/news-cms"

const CmsImageUpload = dynamic(() => import("@/components/admin/cms-image-upload").then((module) => module.CmsImageUpload), { loading: () => <div className="h-24 animate-pulse rounded-2xl bg-emerald-50" /> })
const emptyArticle = createEmptyArticle
const makeSlug = makeNewsSlug
const ImagePlus = ImageAdd
const Clock3 = Clock
const CheckCircle2 = CheckCircle
const Trash2 = Trash

export function NewsManager({ initialData }: { initialData: CmsNewsData }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<CmsNewsData>(initialData)
  const [article, setArticle] = useState<CmsNewsArticle | null>(null)
  const [category, setCategory] = useState("")
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [articleToDelete, setArticleToDelete] = useState<CmsNewsArticle | null>(null)
  const [message, setMessage] = useState("")
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const [status, setStatus] = useState<"all" | "published" | "draft">("all")
  const [articlePage, setArticlePage] = useState(1)
  const [saving, setSaving] = useState(false)
  const articlesPerPage = ARTICLES_PER_PAGE

  useEffect(() => {
    if (initialData.categories.length || initialData.articles.length) return
    const controller = new AbortController()
    void fetch("/api/cms/news", { signal: controller.signal }).then((response) => response.json()).then((value) => {
      if (!controller.signal.aborted) setData(value)
    }).catch((error: unknown) => {
      if ((error as { name?: string }).name !== "AbortError") console.error("CMS news could not be loaded", error)
    })
    return () => controller.abort()
  }, [initialData])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!rootRef.current) return
      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline.fromTo("[data-news-hero]", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .5 })
          .fromTo("[data-news-stat]", { autoAlpha: 0, y: 16, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .36, stagger: .07 }, "-=.28")
          .fromTo("[data-news-panel]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .42, stagger: .1 }, "-=.18")
        gsap.to("[data-news-orb]", { x: 22, y: -14, scale: 1.12, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut" })
      }, rootRef)
    })
    return () => context?.revert()
  }, [])

  useEffect(() => {
    const resetPage = window.setTimeout(() => setArticlePage(1), 0)
    return () => window.clearTimeout(resetPage)
  }, [query, status])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!rootRef.current) return
      context = gsap.context(() => gsap.fromTo("[data-news-row]", { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: .28, stagger: .045, ease: "power2.out", clearProps: "opacity,transform,visibility" }), rootRef)
    })
    return () => context?.revert()
  }, [articlePage, query, status, data.articles.length])

  const isEditorOpen = Boolean(article)

  useEffect(() => {
    if (!isEditorOpen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!editorRef.current) return
      context = gsap.context(() => gsap.fromTo(editorRef.current, { autoAlpha: 0, y: 24, scale: .97 }, { autoAlpha: 1, y: 0, scale: 1, duration: .34, ease: "power3.out" }))
    })
    return () => context?.revert()
  }, [isEditorOpen])

  const save = async (next = data) => {
    setSaving(true)
    try {
      const response = await fetch("/api/cms/news", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) })
      if (!response.ok) throw new Error("Gagal menyimpan")
      setData(next)
      setMessage("Perubahan berita berhasil disimpan.")
    } catch { setMessage("Perubahan belum tersimpan. Coba lagi.") } finally { setSaving(false) }
  }
  const update = <K extends keyof CmsNewsArticle>(key: K, value: CmsNewsArticle[K]) => setArticle((current) => current ? { ...current, [key]: value } : current)
  const saveArticle = async () => {
    if (!article?.title.trim() || !article.category) return setMessage("Judul dan kategori wajib diisi.")
    const previous = data.articles.find((item) => item.id === article.id)
    const savedArticle = article.published && (!previous?.published || !article.publishedAt) ? { ...article, publishedAt: new Date().toISOString() } : article
    await save({ ...data, articles: previous ? data.articles.map((item) => item.id === savedArticle.id ? savedArticle : item) : [savedArticle, ...data.articles] })
    setArticle(null)
  }
  const addCategory = async () => { const value = category.trim(); if (!value || data.categories.includes(value)) return; await save({ ...data, categories: [...data.categories, value] }); setCategory("") }
  const removeCategory = async (value: string) => { await save({ categories: data.categories.filter((item) => item !== value), articles: data.articles.map((item) => item.category === value ? { ...item, category: "" } : item) }); setCategoryToDelete(null) }
  const removeArticle = async () => { if (!articleToDelete) return; await save({ ...data, articles: data.articles.filter((item) => item.id !== articleToDelete.id) }); setArticleToDelete(null) }
  const filteredArticles = useMemo(() => data.articles.filter((item) => `${item.title} ${item.category} ${item.excerpt}`.toLowerCase().includes(deferredQuery.toLowerCase()) && (status === "all" || status === "published" ? item.published : !item.published)), [data.articles, deferredQuery, status])
  const totalArticlePages = Math.max(1, Math.ceil(filteredArticles.length / articlesPerPage))
  const currentArticlePage = Math.min(articlePage, totalArticlePages)
  const visibleArticles = filteredArticles.slice((currentArticlePage - 1) * articlesPerPage, currentArticlePage * articlesPerPage)
  const publishedCount = data.articles.filter((item) => item.published).length

  return <div ref={rootRef} className="space-y-5">
    <section data-news-hero className="relative overflow-hidden rounded-[28px] bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-950/15 sm:px-7 sm:py-7"><span data-news-orb aria-hidden="true" className="absolute -right-10 -top-12 size-48 rounded-full bg-emerald-400/20 blur-3xl" /><span aria-hidden="true" className="absolute bottom-0 left-1/3 size-32 translate-y-2/3 rounded-full bg-cyan-400/10 blur-2xl" /><div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-300">Ruang redaksi</p><h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Kelola kabar untuk warga.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Susun cerita, atur kategori, dan jadwalkan informasi penting desa dari satu workspace.</p></div><Button onClick={() => setArticle(emptyArticle())} size="lg" className="w-full bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/15 hover:bg-emerald-300 sm:w-auto"><Plus />Tulis artikel</Button></div><div className="relative mt-6 grid gap-3 sm:grid-cols-3"><Stat icon={<FileText />} label="Total artikel" value={data.articles.length} /><Stat icon={<Send />} label="Telah terbit" value={publishedCount} /><Stat icon={<Tag />} label="Kategori" value={data.categories.length} /></div></section>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]"><Card data-news-panel className="overflow-hidden border-slate-200/80 shadow-lg shadow-slate-200/40"><CardHeader className="gap-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle className="text-xl font-black">Daftar artikel</CardTitle><CardDescription className="mt-1">{filteredArticles.length} artikel sesuai tampilan saat ini.</CardDescription></div><Button variant="outline" onClick={() => setArticle(emptyArticle())}><Plus />Artikel baru</Button></CardHeader><CardContent className="p-0"><div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-[minmax(0,1fr)_180px]"><label className="relative"><span className="sr-only">Cari artikel</span><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul atau kategori..." className="pl-10" /></label><BrowserlessSelect value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">Semua status</option><option value="published">Sudah terbit</option><option value="draft">Draft</option></BrowserlessSelect></div><div className="divide-y divide-slate-100">{visibleArticles.length ? visibleArticles.map((item) => <article data-news-row key={item.id} className="group flex gap-3 p-4 transition hover:bg-emerald-50/40 sm:items-center sm:gap-4 sm:px-5"><div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-800"><FileText className="size-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="break-words font-bold text-slate-950">{item.title || "Tanpa judul"}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${item.published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{item.published ? "Terbit" : "Draft"}</span></div><p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500"><span>{item.category || "Tanpa kategori"}</span><span className="hidden sm:inline">•</span><span>{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span></p></div><div className="flex shrink-0 gap-1"><Button variant="ghost" size="icon" onClick={() => setArticle(item)} aria-label={`Edit ${item.title}`}><Pencil /></Button><Button variant="ghost" size="icon" onClick={() => setArticleToDelete(item)} className="text-rose-700 hover:bg-rose-50 hover:text-rose-800" aria-label={`Hapus ${item.title}`}><Trash2 /></Button></div></article>) : <div className="grid min-h-56 place-items-center p-6 text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Search /></span><p className="mt-4 font-bold text-slate-900">Artikel tidak ditemukan</p><p className="mt-1 text-sm text-slate-500">Ubah kata pencarian atau filter status.</p></div></div>}</div>{filteredArticles.length ? <div className="border-t border-slate-100 px-4 py-3 sm:px-5"><PaginationControls page={currentArticlePage} totalPages={totalArticlePages} totalItems={filteredArticles.length} pageSize={articlesPerPage} onPageChange={setArticlePage} itemLabel="artikel" /></div> : null}</CardContent></Card>
      <Card data-news-panel className="h-fit border-slate-200/80 shadow-lg shadow-slate-200/40"><CardHeader><CardTitle className="flex items-center gap-2 text-lg font-black"><Tag className="size-5 text-emerald-700" />Kategori berita</CardTitle><CardDescription>Kelompokkan artikel agar mudah ditemukan warga.</CardDescription></CardHeader><CardContent><ul aria-label="Daftar kategori berita" className="flex flex-wrap gap-2">{data.categories.map((item) => <li key={item} className="inline-flex max-w-full items-center gap-1 rounded-full bg-emerald-50 py-1.5 pl-3 pr-1 text-sm font-bold text-emerald-800">{item}<button type="button" onClick={() => setCategoryToDelete(item)} className="rounded-full p-1 text-emerald-700 transition hover:bg-emerald-200" aria-label={`Hapus kategori ${item}`}><X className="size-3.5" /></button></li>)}{!data.categories.length ? <li className="text-sm text-slate-500">Belum ada kategori.</li> : null}</ul><div className="mt-5 space-y-2"><Input value={category} onChange={(event) => setCategory(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void addCategory() } }} placeholder="Nama kategori baru" /><Button type="button" variant="secondary" className="w-full" onClick={() => void addCategory()} disabled={saving}><Plus />Tambah kategori</Button></div></CardContent></Card></div>

    <NewsNoticeDialog message={message} onOpenChange={(open) => !open && setMessage("")} />

    <Dialog open={Boolean(article)} onOpenChange={(open) => !open && setArticle(null)}><DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto p-0"><div ref={editorRef} data-news-editor className="bg-white p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Editor berita</p><DialogTitle className="mt-1 text-2xl font-black text-slate-950">{article && data.articles.some((item) => item.id === article.id) ? "Edit artikel" : "Artikel baru"}</DialogTitle><DialogDescription className="mt-2">Lengkapi informasi di bawah sebelum mempublikasikannya.</DialogDescription></div><Button variant="ghost" size="icon" onClick={() => setArticle(null)} aria-label="Tutup editor"><X /></Button></div>{article ? <div className="mt-6 grid gap-5 md:grid-cols-2"><label className="text-sm font-bold text-slate-700 md:col-span-2">Judul artikel<Input value={article.title} onChange={(event) => { update("title", event.target.value); update("slug", makeSlug(event.target.value)) }} className="mt-2" placeholder="Contoh: Kerja bakti di Dusun Krajan" /></label><label className="text-sm font-bold text-slate-700">Kategori<BrowserlessSelect value={article.category} onChange={(event) => update("category", event.target.value)} className="mt-2"><option value="">Pilih kategori</option>{data.categories.map((item) => <option key={item}>{item}</option>)}</BrowserlessSelect></label><label className="text-sm font-bold text-slate-700">Slug URL<Input value={article.slug} onChange={(event) => update("slug", makeSlug(event.target.value))} className="mt-2" placeholder="judul-artikel" /></label><label className="text-sm font-bold text-slate-700 md:col-span-2">Ringkasan<Textarea value={article.excerpt} onChange={(event) => update("excerpt", event.target.value)} className="mt-2 min-h-24" rows={3} placeholder="Ringkasan singkat yang tampil pada daftar berita." /></label><label className="text-sm font-bold text-slate-700 md:col-span-2">Isi artikel<Textarea value={article.content} onChange={(event) => update("content", event.target.value)} className="mt-2 min-h-56" rows={10} placeholder="Tulis isi artikel di sini..." /></label><div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-4 md:col-span-2"><p className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-900"><ImagePlus className="size-4" />Sisipkan gambar pada isi artikel</p><CmsImageUpload onUploaded={(url) => update("content", `${article.content}${article.content ? "\n\n" : ""}![Gambar artikel](${url})`)} /></div><label className="text-sm font-bold text-slate-700 md:col-span-2">URL gambar utama<Input value={article.image} onChange={(event) => update("image", event.target.value)} className="mt-2" placeholder="https://..." /></label><div className="md:col-span-2"><CmsImageUpload onUploaded={(url) => update("image", url)} /></div><label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-800 md:col-span-2"><input type="checkbox" checked={article.published} onChange={(event) => update("published", event.target.checked)} className="size-4 accent-emerald-700" />{article.published ? <Send className="size-4 text-emerald-700" /> : <Clock3 className="size-4 text-amber-700" />}{article.published ? "Publikasikan artikel untuk warga" : "Simpan sebagai draft"}</label></div> : null}<div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><Button variant="ghost" onClick={() => setArticle(null)}>Batal</Button><Button onClick={() => void saveArticle()} disabled={saving}><Save />{saving ? "Menyimpan..." : "Simpan artikel"}</Button></div></div></DialogContent></Dialog>
    <ConfirmDialog open={Boolean(categoryToDelete)} title="Hapus kategori?" description={categoryToDelete ? `Kategori ${categoryToDelete}${data.articles.some((item) => item.category === categoryToDelete) ? " sedang dipakai artikel. Artikel tetap ada, tetapi kategorinya akan dikosongkan." : " akan dihapus permanen."}` : ""} busy={saving} onOpenChange={(open) => !open && setCategoryToDelete(null)} onConfirm={() => categoryToDelete && void removeCategory(categoryToDelete)} />
    <ConfirmDialog open={Boolean(articleToDelete)} title="Hapus artikel?" description={articleToDelete ? `Artikel “${articleToDelete.title || "Tanpa judul"}” akan dihapus permanen dari daftar berita.` : ""} busy={saving} onOpenChange={(open) => !open && setArticleToDelete(null)} onConfirm={() => void removeArticle()} />
  </div>
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div data-news-stat className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.07] px-4 py-3 backdrop-blur-sm"><span className="grid size-9 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">{icon}</span><div><p className="text-xl font-black tabular-nums text-white">{value}</p><p className="text-xs font-semibold text-slate-300">{label}</p></div></div> }
function NewsNoticeDialog({ message, onOpenChange }: { message: string; onOpenChange: (open: boolean) => void }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const success = message.includes("berhasil")
  useEffect(() => {
    if (!message || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!contentRef.current) return
      context = gsap.context(() => gsap.timeline({ defaults: { ease: "power3.out" } }).fromTo(contentRef.current, { autoAlpha: 0, y: 20, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .3 }).fromTo("[data-news-notice-icon]", { scale: .55, rotate: success ? -18 : 14 }, { scale: 1, rotate: 0, duration: .34, ease: "back.out(1.7)" }, "-=.14"))
    })
    return () => context?.revert()
  }, [message, success])
  return <Dialog open={Boolean(message)} onOpenChange={onOpenChange}><DialogContent className="max-w-sm p-0"><div ref={contentRef} className="p-6"><span data-news-notice-icon className={`grid size-12 place-items-center rounded-2xl ${success ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{success ? <CheckCircle2 className="size-6" /> : <AlertCircle className="size-6" />}</span><DialogTitle className="mt-5 text-xl font-black text-slate-950">{success ? "Berhasil disimpan" : "Perlu dilengkapi"}</DialogTitle><DialogDescription className="mt-2 leading-6">{message}</DialogDescription><div className="mt-6 flex justify-end"><Button onClick={() => onOpenChange(false)}>Mengerti</Button></div></div></DialogContent></Dialog>
}
function ConfirmDialog({ open, title, description, busy, onOpenChange, onConfirm }: { open: boolean; title: string; description: string; busy: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!contentRef.current) return
      context = gsap.context(() => gsap.timeline({ defaults: { ease: "power3.out" } }).fromTo(contentRef.current, { autoAlpha: 0, y: 18, scale: .96 }, { autoAlpha: 1, y: 0, scale: 1, duration: .3 }).fromTo("[data-confirm-icon]", { scale: .6, rotate: -12 }, { scale: 1, rotate: 0, duration: .3, ease: "back.out(1.7)" }, "-=.12"))
    })
    return () => context?.revert()
  }, [open])
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-md p-0"><div ref={contentRef} className="p-6"><span data-confirm-icon className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-700"><AlertTriangle className="size-6" /></span><DialogTitle className="mt-5 text-xl font-black text-slate-950">{title}</DialogTitle><DialogDescription className="mt-2 leading-6">{description}</DialogDescription><div className="mt-6 flex justify-end gap-3"><Button variant="ghost" disabled={busy} onClick={() => onOpenChange(false)}>Batal</Button><Button disabled={busy} onClick={onConfirm} className="bg-rose-700 hover:bg-rose-800"><Trash2 />{busy ? "Menghapus..." : "Hapus permanen"}</Button></div></div></DialogContent></Dialog>
}
