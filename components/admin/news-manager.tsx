"use client"


import { BrowserlessSelect } from "@/components/ui/select"
import { LegacyDatePicker } from "@/components/ui/date-picker"
import { useEffect, useState } from "react"
import { AlertTriangle, Check, Pencil, Plus, Save, Trash2 } from "lucide-react"
import { CmsImageUpload } from "@/components/admin/cms-image-upload"
import { PaginationControls } from "@/components/ui/pagination-controls"
import type { CmsNewsArticle, CmsNewsData } from "@/lib/news-cms"

const makeSlug = (title: string) => title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
const emptyArticle = (): CmsNewsArticle => ({ id: crypto.randomUUID(), title: "", slug: "", excerpt: "", content: "", image: "", category: "", published: true, createdAt: new Date().toISOString() })
const input = "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"

export function NewsManager({ initialData }: { initialData: CmsNewsData }) {
  const [data, setData] = useState<CmsNewsData>(initialData)
  const [article, setArticle] = useState<CmsNewsArticle | null>(null)
  const [category, setCategory] = useState("")
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [articlePage, setArticlePage] = useState(1)
  const articlesPerPage = 10
  useEffect(() => {
    // Data awal sudah dirender oleh Server Component. Fetch ini hanya menjadi
    // fallback bila editor dipakai tanpa data awal.
    if (initialData.categories.length || initialData.articles.length) return
    const controller = new AbortController()

    void fetch("/api/cms/news", { signal: controller.signal })
      .then((response) => response.json())
      .then((value) => {
        if (!controller.signal.aborted) setData(value)
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== "AbortError") console.error("CMS news could not be loaded", error)
      })

    return () => controller.abort()
  }, [initialData])
  const save = async (next = data) => { const response = await fetch("/api/cms/news", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) }); if (response.ok) { setData(next); setArticlePage(1); setMessage("Perubahan berita disimpan.") } }
  const update = <K extends keyof CmsNewsArticle>(key: K, value: CmsNewsArticle[K]) => setArticle((current) => current ? { ...current, [key]: value } : current)
  const saveArticle = async () => { if (!article?.title.trim() || !article.category) return setMessage("Judul dan kategori wajib diisi."); const previous = data.articles.find((item) => item.id === article.id); const savedArticle = article.published && (!previous?.published || !article.publishedAt) ? { ...article, publishedAt: new Date().toISOString() } : article; const next = { ...data, articles: previous ? data.articles.map((item) => item.id === savedArticle.id ? savedArticle : item) : [savedArticle, ...data.articles] }; await save(next); setArticle(null) }
  const addCategory = async () => { const value = category.trim(); if (!value || data.categories.includes(value)) return; await save({ ...data, categories: [...data.categories, value] }); setCategory("") }
  const removeCategory = async (value: string) => {
    const used = data.articles.some((item) => item.category === value)
    await save({ categories: data.categories.filter((item) => item !== value), articles: data.articles.map((item) => item.category === value ? { ...item, category: "" } : item) })
    setCategoryToDelete(null)
  }
  const remove = async (id: string) => { if (!confirm("Hapus artikel ini?")) return; await save({ ...data, articles: data.articles.filter((item) => item.id !== id) }) }
  const totalArticlePages = Math.max(1, Math.ceil(data.articles.length / articlesPerPage))
  const currentArticlePage = Math.min(articlePage, totalArticlePages)
  const visibleArticles = data.articles.slice((currentArticlePage - 1) * articlesPerPage, currentArticlePage * articlesPerPage)
  return <div className="space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h2 className="text-xl font-black text-slate-950">Kategori</h2><div className="mt-4 flex flex-wrap gap-2">{data.categories.map((item) => <span key={item} className="inline-flex max-w-full items-center gap-1 rounded-full bg-emerald-50 py-1 pl-3 pr-1 text-sm font-bold text-emerald-800">{item}<button type="button" onClick={() => setCategoryToDelete(item)} className="shrink-0 rounded-full p-1 text-emerald-700 hover:bg-emerald-200" aria-label={`Hapus kategori ${item}`}><Trash2 className="h-3.5 w-3.5" /></button></span>)}</div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={category} onChange={(event) => setCategory(event.target.value)} className={input} placeholder="Contoh: Pengumuman" /><button type="button" onClick={() => void addCategory()} className="mt-1.5 inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white"><Plus className="h-4 w-4" />Tambah</button></div></section>
    <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-black text-slate-950">Artikel</h2><button type="button" onClick={() => setArticle(emptyArticle())} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Artikel baru</button></div><div className="mt-5 divide-y divide-slate-100">{data.articles.length ? visibleArticles.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 py-4"><div className="min-w-0"><p className="break-words font-bold text-slate-950">{item.title}</p><p className="mt-1 break-words text-xs text-slate-500">{item.category} · {item.published ? "Terbit" : "Draft"}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => setArticle(item)} className="min-h-10 min-w-10 rounded-lg bg-slate-100 p-2 text-slate-700"><Pencil className="h-4 w-4" /></button><button onClick={() => void remove(item.id)} className="min-h-10 min-w-10 rounded-lg bg-rose-50 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button></div></div>) : <p className="py-6 text-sm font-medium text-slate-500">Belum ada artikel.</p>}</div><PaginationControls page={currentArticlePage} totalPages={totalArticlePages} totalItems={data.articles.length} pageSize={articlesPerPage} onPageChange={setArticlePage} itemLabel="artikel" /></section>
    {article ? <section className="rounded-[28px] border border-emerald-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-xl font-black text-slate-950">{data.articles.some((item) => item.id === article.id) ? "Edit artikel" : "Artikel baru"}</h2><button onClick={() => setArticle(null)} className="text-sm font-bold text-slate-500">Batal</button></div><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="md:col-span-2 text-sm font-bold text-slate-700">Judul<input value={article.title} onChange={(event) => { update("title", event.target.value); update("slug", makeSlug(event.target.value)) }} className={input} /></label><label className="text-sm font-bold text-slate-700">Kategori<BrowserlessSelect value={article.category} onChange={(event) => update("category", event.target.value)} className={input}><option value="">Pilih kategori</option>{data.categories.map((item) => <option key={item}>{item}</option>)}</BrowserlessSelect></label><label className="text-sm font-bold text-slate-700">Slug<input value={article.slug} onChange={(event) => update("slug", makeSlug(event.target.value))} className={input} /></label><label className="md:col-span-2 text-sm font-bold text-slate-700">Ringkasan<textarea value={article.excerpt} onChange={(event) => update("excerpt", event.target.value)} className={input} rows={2} /></label><label className="md:col-span-2 text-sm font-bold text-slate-700">Isi artikel<textarea value={article.content} onChange={(event) => update("content", event.target.value)} className={input} rows={8} /></label><div className="md:col-span-2 rounded-2xl border border-dashed border-emerald-200 p-4"><p className="mb-3 text-sm font-bold text-slate-800">Sisipkan gambar di isi artikel</p><CmsImageUpload onUploaded={(url) => update("content", `${article.content}${article.content ? "\n\n" : ""}![Gambar artikel](${url})`)} /></div><label className="md:col-span-2 text-sm font-bold text-slate-700">URL gambar utama<input value={article.image} onChange={(event) => update("image", event.target.value)} className={input} /></label><div className="md:col-span-2"><CmsImageUpload onUploaded={(url) => update("image", url)} /></div><label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={article.published} onChange={(event) => update("published", event.target.checked)} />Terbitkan artikel</label></div><button onClick={() => void saveArticle()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"><Save className="h-4 w-4" />Simpan artikel</button></section> : null}
    {message ? <p className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700"><Check className="h-4 w-4" />{message}</p> : null}
    {categoryToDelete ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"><div role="dialog" aria-modal="true" aria-labelledby="delete-category-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-700"><AlertTriangle className="h-5 w-5" /></span><h2 id="delete-category-title" className="mt-4 text-xl font-black text-slate-950">Hapus kategori?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Kategori <b>{categoryToDelete}</b>{data.articles.some((item) => item.category === categoryToDelete) ? " sedang dipakai artikel. Artikel tersebut tidak dihapus, tetapi kategorinya akan dikosongkan." : " akan dihapus permanen."}</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setCategoryToDelete(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600">Batal</button><button type="button" onClick={() => void removeCategory(categoryToDelete)} className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700">Hapus kategori</button></div></div></div> : null}
  </div>
}


