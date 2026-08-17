"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Save } from "lucide-react"
import type { CmsPageContent } from "@/lib/cms-pages"
import { CmsImageUpload } from "@/components/admin/cms-image-upload"

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-700 focus:bg-white"

export function CmsPageEditor() {
  const searchParams = useSearchParams()
  const [pages, setPages] = useState<CmsPageContent[]>([])
  const [active, setActive] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/cms/pages")
      .then((response) => response.json())
      .then((payload) => setPages(payload.pages ?? []))
  }, [])

  useEffect(() => {
    const slug = searchParams.get("halaman")
    const index = pages.findIndex((item) => item.slug === slug)
    if (index >= 0) {
      setActive(index)
      setActiveSection(0)
    }
  }, [pages, searchParams])

  const update = (field: keyof CmsPageContent, value: string) => {
    setPages((current) => current.map((page, index) => (index === active ? { ...page, [field]: value } : page)))
  }

  const updateSection = (field: "eyebrow" | "title" | "description" | "action" | "href" | "image", value: string) => {
    setPages((current) =>
      current.map((page, pageIndex) =>
        pageIndex === active
          ? {
              ...page,
              sections: page.sections.map((section, sectionIndex) => (sectionIndex === activeSection ? { ...section, [field]: value } : section)),
            }
          : page,
      ),
    )
  }

  const updateItem = (itemIndex: number, field: "title" | "description" | "value" | "detail" | "href" | "category" | "date" | "image", value: string) => {
    setPages((current) =>
      current.map((page, pageIndex) =>
        pageIndex === active
          ? {
              ...page,
              sections: page.sections.map((section, sectionIndex) =>
                sectionIndex === activeSection
                  ? {
                      ...section,
                      items: (section.items ?? []).map((item, index) => (index === itemIndex ? { ...item, [field]: value } : item)),
                    }
                  : section,
              ),
            }
          : page,
      ),
    )
  }

  const save = async () => {
    setSaving(true)
    setMessage("")

    const response = await fetch("/api/cms/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages }),
    })
    const payload = await response.json()

    setPages(payload.pages ?? pages)
    setSaving(false)
    setMessage(response.ok ? "Konten halaman berhasil disimpan." : "Konten gagal disimpan.")
  }

  const page = pages[active]
  const section = page?.sections?.[activeSection]

  if (!page) {
    return <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">Memuat data CMS...</div>
  }

  return (
    <section id="konten-halaman" className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Konten halaman</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Atur isi halaman publik</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Hero dan section halaman dibaca langsung oleh halaman publik.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="grid gap-2 lg:w-56">
          {pages.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => {
                setActive(index)
                setActiveSection(0)
              }}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                active === index ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-700 hover:bg-emerald-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Hero halaman</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-bold text-slate-700">
              Eyebrow
              <input value={page.eyebrow} onChange={(event) => update("eyebrow", event.target.value)} className={inputClass} />
            </label>
            <label className="text-sm font-bold text-slate-700">
              Posisi gambar
              <input value={page.imagePosition} onChange={(event) => update("imagePosition", event.target.value)} className={inputClass} />
            </label>
            <label className="md:col-span-2 text-sm font-bold text-slate-700">
              Judul
              <input value={page.title} onChange={(event) => update("title", event.target.value)} className={inputClass} />
            </label>
            <label className="md:col-span-2 text-sm font-bold text-slate-700">
              Deskripsi
              <textarea value={page.description} onChange={(event) => update("description", event.target.value)} rows={3} className={inputClass} />
            </label>
            <label className="md:col-span-2 text-sm font-bold text-slate-700">
              URL gambar hero
              <input value={page.image} onChange={(event) => update("image", event.target.value)} className={inputClass} />
            </label>
            <div className="md:col-span-2">
              <CmsImageUpload onUploaded={(url) => update("image", url)} />
            </div>
          </div>

          {page.sections.length ? (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {page.sections.map((item, index) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveSection(index)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      activeSection === index ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-emerald-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {section ? (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm font-bold text-slate-700">
                      Eyebrow section
                      <input value={section.eyebrow ?? ""} onChange={(event) => updateSection("eyebrow", event.target.value)} className={inputClass} />
                    </label>
                    <label className="text-sm font-bold text-slate-700">
                      Teks tombol
                      <input value={section.action ?? ""} onChange={(event) => updateSection("action", event.target.value)} className={inputClass} />
                    </label>
                    <label className="md:col-span-2 text-sm font-bold text-slate-700">
                      Judul section
                      <input value={section.title ?? ""} onChange={(event) => updateSection("title", event.target.value)} className={inputClass} />
                    </label>
                    <label className="md:col-span-2 text-sm font-bold text-slate-700">
                      Deskripsi section
                      <textarea value={section.description ?? ""} onChange={(event) => updateSection("description", event.target.value)} rows={2} className={inputClass} />
                    </label>
                    <label className="md:col-span-2 text-sm font-bold text-slate-700">
                      URL gambar section
                      <input value={section.image ?? ""} onChange={(event) => updateSection("image", event.target.value)} className={inputClass} placeholder="/images/contoh.jpg" />
                    </label>
                    <div className="md:col-span-2">
                      <CmsImageUpload onUploaded={(url) => updateSection("image", url)} />
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {(section.items ?? []).map((item, itemIndex) => (
                      <div key={`${section.key}-${itemIndex}`} className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Item {itemIndex + 1}</p>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <input value={item.title} onChange={(event) => updateItem(itemIndex, "title", event.target.value)} className={inputClass} placeholder="Judul item" />
                          <input value={item.value ?? ""} onChange={(event) => updateItem(itemIndex, "value", event.target.value)} className={inputClass} placeholder="Nilai/statistik" />
                          <input value={item.detail ?? ""} onChange={(event) => updateItem(itemIndex, "detail", event.target.value)} className={inputClass} placeholder="Detail kecil" />
                          <input value={item.href ?? ""} onChange={(event) => updateItem(itemIndex, "href", event.target.value)} className={inputClass} placeholder="Link" />
                          <input value={item.image ?? ""} onChange={(event) => updateItem(itemIndex, "image", event.target.value)} className={`${inputClass} md:col-span-2`} placeholder="URL gambar item" />
                          <textarea value={item.description ?? ""} onChange={(event) => updateItem(itemIndex, "description", event.target.value)} rows={2} className={`${inputClass} md:col-span-2`} placeholder="Deskripsi" />
                          <div className="md:col-span-2"><CmsImageUpload onUploaded={(url) => updateItem(itemIndex, "image", url)} /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : page.slug === "berita" ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-bold text-emerald-950">Artikel berita dikelola terpisah.</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">Halaman ini hanya mengatur tampilan hero. Untuk menambah, edit, hapus artikel, atau kategori, gunakan Kelola Berita.</p>
              <Link href="/admin/berita" className="mt-4 inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">Buka Kelola Berita</Link>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
              Section halaman ini belum disambungkan ke CMS. Hero sudah bisa diedit.
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60">
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan perubahan"}
            </button>
            {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
