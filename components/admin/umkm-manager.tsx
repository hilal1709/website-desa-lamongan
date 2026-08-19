"use client"

import { useEffect, useState } from "react"
import { Check, Pencil, Plus, Save, Trash2, X } from "lucide-react"
import { CmsImageUpload } from "@/components/admin/cms-image-upload"
import { PaginationControls } from "@/components/ui/pagination-controls"

type Product = { id: string; name: string; description: string; imageUrl: string; price: number; isAvailable: boolean }
type Business = { id: string; name: string; slug: string; category: string; description: string; logoUrl: string; whatsapp: string; address: string | null; isPublished: boolean; products: Product[] }
type ProfileForm = Omit<Business, "id" | "products"> & { id?: string }
type ProductForm = Omit<Product, "id"> & { id?: string }

const input = "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white"
const emptyProfile = (): ProfileForm => ({ name: "", slug: "", category: "", description: "", logoUrl: "", whatsapp: "", address: "", isPublished: true })
const emptyProduct = (): ProductForm => ({ name: "", description: "", imageUrl: "", price: 0, isAvailable: true })
const makeSlug = (value: string) => value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
async function readResponse<T>(response: Response): Promise<T & { message?: string }> {
  const body = await response.text()
  if (!body) return { message: "Server tidak mengirim respons. Silakan coba lagi." } as T & { message?: string }
  try { return JSON.parse(body) as T & { message?: string } } catch { return { message: "Respons server tidak valid. Silakan coba lagi." } as T & { message?: string } }
}

export function UmkmManager() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [editing, setEditing] = useState<Business | null>(null)
  const [creating, setCreating] = useState<ProfileForm | null>(null)
  const [product, setProduct] = useState<ProductForm | null>(null)
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)
  const [businessPage, setBusinessPage] = useState(1)
  const businessesPerPage = 10
  const load = async () => { try { const response = await fetch("/api/cms/umkm"); const data = await readResponse<{ businesses?: Business[] }>(response); if (response.ok) setBusinesses(data.businesses ?? []); else setMessage(data.message ?? "Data UMKM gagal dimuat.") } catch { setMessage("Koneksi ke server gagal. Silakan coba lagi.") } }
  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [])
  const current = creating ?? editing
  const setField = <K extends keyof ProfileForm>(field: K, value: ProfileForm[K]) => {
    if (creating) setCreating((current) => current ? { ...current, [field]: value } : current)
    if (editing) setEditing((current) => current ? { ...current, [field]: value } : current)
  }
  const saveProfile = async () => {
    if (!current) return
    setSaving(true); setMessage("")
    const response = await fetch("/api/cms/umkm", { method: current.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(current) })
    const data = await readResponse<{ business?: Business }>(response)
    setSaving(false)
    if (!response.ok || !data.business) return setMessage(data.message ?? "Profil UMKM gagal disimpan.")
    setCreating(null); setEditing(data.business); setMessage("Profil UMKM disimpan."); await load()
  }
  const removeBusiness = async (id: string) => {
    if (!confirm("Hapus UMKM beserta seluruh produknya?")) return
    const response = await fetch(`/api/cms/umkm?id=${id}`, { method: "DELETE" })
    if (response.ok) { setEditing(null); setMessage("UMKM dihapus."); await load() } else setMessage("UMKM gagal dihapus.")
  }
  const saveProduct = async () => {
    if (!editing || !product) return
    setSaving(true); setMessage("")
    const response = await fetch("/api/cms/umkm/products", { method: product.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(product.id ? product : { ...product, umkmId: editing.id }) })
    const data = await readResponse<{ product?: Product }>(response)
    setSaving(false)
    if (!response.ok || !data.product) return setMessage(data.message ?? "Produk gagal disimpan.")
    const next = product.id ? editing.products.map((item) => item.id === product.id ? data.product! : item) : [...editing.products, data.product]
    setEditing({ ...editing, products: next }); setProduct(null); setMessage("Produk disimpan."); await load()
  }
  const removeProduct = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return
    const response = await fetch(`/api/cms/umkm/products?id=${id}`, { method: "DELETE" })
    if (response.ok && editing) { setEditing({ ...editing, products: editing.products.filter((item) => item.id !== id) }); setMessage("Produk dihapus."); await load() } else setMessage("Produk gagal dihapus.")
  }

  const totalBusinessPages = Math.max(1, Math.ceil(businesses.length / businessesPerPage))
  const currentBusinessPage = Math.min(businessPage, totalBusinessPages)
  const visibleBusinesses = businesses.slice((currentBusinessPage - 1) * businessesPerPage, currentBusinessPage * businessesPerPage)
  return <div className="space-y-5"><section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Daftar usaha</p><h2 className="mt-1 text-xl font-black text-slate-950">UMKM terdaftar</h2></div><button type="button" onClick={() => { setEditing(null); setCreating(emptyProfile()); setProduct(null) }} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"><Plus className="size-4" />Tambah UMKM</button></div><div className="mt-5 divide-y divide-slate-100">{businesses.length ? visibleBusinesses.map((business) => <div key={business.id} className="flex items-center justify-between gap-4 py-4"><div className="flex min-w-0 items-center gap-3"><UmkmThumbnail src={business.logoUrl} name={business.name} /><div className="min-w-0"><p className="truncate font-bold text-slate-950">{business.name}</p><p className="mt-1 text-xs text-slate-500">{business.category} · {business.products.length} produk · {business.isPublished ? "Tayang" : "Disembunyikan"}</p></div></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => { setCreating(null); setEditing(business); setProduct(null) }} className="rounded-lg bg-slate-100 p-2 text-slate-700" aria-label={`Edit ${business.name}`}><Pencil className="size-4" /></button><button type="button" onClick={() => void removeBusiness(business.id)} className="rounded-lg bg-rose-50 p-2 text-rose-700" aria-label={`Hapus ${business.name}`}><Trash2 className="size-4" /></button></div></div>) : <p className="py-8 text-center text-sm font-medium text-slate-500">Belum ada UMKM. Tambahkan profil usaha pertama.</p>}</div><PaginationControls page={currentBusinessPage} totalPages={totalBusinessPages} totalItems={businesses.length} pageSize={businessesPerPage} onPageChange={setBusinessPage} itemLabel="UMKM" /></section>{current ? <section className="rounded-[28px] border border-emerald-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Profil UMKM</p><h2 className="mt-1 text-xl font-black text-slate-950">{current.id ? `Edit ${current.name}` : "UMKM baru"}</h2></div><button type="button" onClick={() => { setCreating(null); setEditing(null); setProduct(null) }} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Tutup form"><X className="size-5" /></button></div><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="text-sm font-bold text-slate-700">Nama UMKM<input value={current.name} onChange={(event) => { setField("name", event.target.value); if (!current.id) setField("slug", makeSlug(event.target.value)) }} className={input} /></label><label className="text-sm font-bold text-slate-700">Slug URL<input value={current.slug} onChange={(event) => setField("slug", makeSlug(event.target.value))} className={input} placeholder="nama-umkm" /></label><label className="text-sm font-bold text-slate-700">Kategori usaha<input value={current.category} onChange={(event) => setField("category", event.target.value)} className={input} placeholder="Contoh: Makanan & Minuman" /></label><label className="text-sm font-bold text-slate-700">Nomor WhatsApp<input value={current.whatsapp} onChange={(event) => setField("whatsapp", event.target.value)} className={input} placeholder="08123456789" /></label><label className="md:col-span-2 text-sm font-bold text-slate-700">Deskripsi<textarea value={current.description} onChange={(event) => setField("description", event.target.value)} className={input} rows={4} /></label><label className="md:col-span-2 text-sm font-bold text-slate-700">Alamat (opsional)<input value={current.address ?? ""} onChange={(event) => setField("address", event.target.value)} className={input} /></label><label className="md:col-span-2 text-sm font-bold text-slate-700">URL logo<input value={current.logoUrl} onChange={(event) => setField("logoUrl", event.target.value)} className={input} /></label><div className="md:col-span-2"><CmsImageUpload onUploaded={(url) => setField("logoUrl", url)} /></div><label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={current.isPublished} onChange={(event) => setField("isPublished", event.target.checked)} />Tayangkan profil UMKM</label></div><button type="button" disabled={saving} onClick={() => void saveProfile()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"><Save className="size-4" />{saving ? "Menyimpan..." : "Simpan profil"}</button>{editing ? <ProductSection business={editing} product={product} setProduct={setProduct} saveProduct={saveProduct} removeProduct={removeProduct} saving={saving} /> : <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-900">Simpan profil terlebih dahulu sebelum menambahkan produk.</p>}</section> : null}{message ? <p className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700"><Check className="size-4" />{message}</p> : null}</div>
}

function UmkmThumbnail({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <div aria-label={`Logo ${name} belum tersedia`} className="grid size-11 shrink-0 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 text-sm font-black text-emerald-800">{name.trim().slice(0, 1).toUpperCase() || "U"}</div>
  return <img src={src} alt={`Logo ${name}`} onError={() => setFailed(true)} className="size-11 shrink-0 rounded-xl border border-slate-100 object-cover" />
}

function ProductSection({ business, product, setProduct, saveProduct, removeProduct, saving }: { business: Business; product: ProductForm | null; setProduct: (value: ProductForm | null) => void; saveProduct: () => void; removeProduct: (id: string) => void; saving: boolean }) {
  const [page, setPage] = useState(1)
  const perPage = 8
  const update = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => setProduct(product ? { ...product, [key]: value } : product)
  const totalPages = Math.max(1, Math.ceil(business.products.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const visibleProducts = business.products.slice((currentPage - 1) * perPage, currentPage * perPage)
  return <section className="mt-7 border-t border-slate-100 pt-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Produk</p><h3 className="mt-1 text-lg font-black text-slate-950">Katalog {business.name}</h3></div><button type="button" onClick={() => setProduct(emptyProduct())} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-50"><Plus className="size-4" />Tambah produk</button></div><div className="mt-4 divide-y divide-slate-100">{business.products.length ? visibleProducts.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-3"><div className="flex min-w-0 items-center gap-3"><img src={item.imageUrl} alt="" className="size-12 rounded-xl object-cover" /><div className="min-w-0"><p className="truncate font-bold text-slate-950">{item.name}</p><p className="text-xs text-slate-500">Rp{new Intl.NumberFormat("id-ID").format(item.price)} · {item.isAvailable ? "Tersedia" : "Nonaktif"}</p></div></div><div className="flex gap-2"><button type="button" onClick={() => setProduct(item)} className="rounded-lg bg-slate-100 p-2 text-slate-700" aria-label={`Edit ${item.name}`}><Pencil className="size-4" /></button><button type="button" onClick={() => removeProduct(item.id)} className="rounded-lg bg-rose-50 p-2 text-rose-700" aria-label={`Hapus ${item.name}`}><Trash2 className="size-4" /></button></div></div>) : <p className="py-5 text-sm text-slate-500">Belum ada produk.</p>}</div><PaginationControls page={currentPage} totalPages={totalPages} totalItems={business.products.length} pageSize={perPage} onPageChange={setPage} itemLabel="produk" />{product ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4"><div className="flex items-center justify-between"><h4 className="font-black text-slate-950">{product.id ? "Edit produk" : "Produk baru"}</h4><button type="button" onClick={() => setProduct(null)} className="text-sm font-bold text-slate-500">Batal</button></div><div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-sm font-bold text-slate-700">Nama produk<input value={product.name} onChange={(event) => update("name", event.target.value)} className={input} /></label><label className="text-sm font-bold text-slate-700">Harga (Rupiah)<input type="number" min="1" value={product.price || ""} onChange={(event) => update("price", Number(event.target.value))} className={input} /></label><label className="md:col-span-2 text-sm font-bold text-slate-700">Deskripsi produk<textarea value={product.description} onChange={(event) => update("description", event.target.value)} className={input} rows={3} /></label><label className="md:col-span-2 text-sm font-bold text-slate-700">URL gambar produk<input value={product.imageUrl} onChange={(event) => update("imageUrl", event.target.value)} className={input} /></label><div className="md:col-span-2"><CmsImageUpload onUploaded={(url) => update("imageUrl", url)} /></div><label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={product.isAvailable} onChange={(event) => update("isAvailable", event.target.checked)} />Produk tersedia untuk dipesan</label></div><button type="button" disabled={saving} onClick={saveProduct} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save className="size-4" />Simpan produk</button></div> : null}</section>
}
