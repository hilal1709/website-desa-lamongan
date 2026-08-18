"use client"

import Link from "next/link"
import { useState } from "react"
import { Boxes, Package, Store, Tag } from "lucide-react"
import type { UmkmCatalogItem, UmkmPublicData } from "@/types"
import { PaginationControls } from "@/components/ui/pagination-controls"

const formatter = new Intl.NumberFormat("id-ID")

export function UmkmVisualization({ data }: { data: UmkmPublicData }) {
  const maximum = Math.max(...data.categories.map((item) => item.businesses), 1)
  return <section className="mt-6" aria-label="Visualisasi UMKM"><div className="grid gap-3 sm:grid-cols-3"><Metric icon={Store} label="UMKM aktif" value={data.totalBusinesses} /><Metric icon={Package} label="Produk tersedia" value={data.totalProducts} /><Metric icon={Tag} label="Kategori usaha" value={data.categories.length} /></div><div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Sebaran usaha</p><h3 className="mt-1 text-lg font-black text-slate-900">UMKM menurut kategori</h3><p className="mt-1 text-sm text-slate-500">Jumlah pelaku usaha dan produk aktif pada setiap kategori.</p></div>{data.categories.length ? <div className="mt-6 space-y-4">{data.categories.map((item) => <div key={item.category}><div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-sm"><span className="font-bold text-slate-800">{item.category}</span><span className="text-slate-500">{formatter.format(item.businesses)} UMKM · {formatter.format(item.products)} produk</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500" style={{ width: `${(item.businesses / maximum) * 100}%` }} /></div></div>)}</div> : <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">Belum ada data UMKM yang diterbitkan.</p>}</div></section>
}

function Metric({ icon: Icon, label, value }: { icon: typeof Store; label: string; value: number }) {
  return <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"><span className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-800"><Icon className="size-5" /></span><p className="mt-4 text-3xl font-black text-slate-950">{formatter.format(value)}</p><p className="mt-1 text-sm font-bold text-slate-600">{label}</p></article>
}

export function UmkmCatalog({ catalog }: { catalog: UmkmCatalogItem[] }) {
  const [page, setPage] = useState(1)
  if (!catalog.length) return <section className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"><Boxes className="mx-auto size-9 text-slate-400" /><h3 className="mt-3 text-lg font-black text-slate-900">Katalog UMKM sedang disiapkan</h3><p className="mt-2 text-sm leading-6 text-slate-500">Profil dan produk UMKM akan tampil setelah diterbitkan oleh admin desa.</p></section>
  const perPage = 9
  const totalPages = Math.max(1, Math.ceil(catalog.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const visibleCatalog = catalog.slice((currentPage - 1) * perPage, currentPage * perPage)
  return <section className="mt-6" aria-label="Katalog UMKM"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleCatalog.map((business) => <Link key={business.id} href={`/infografis/umkm/${business.slug}`} prefetch={false} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"><div className="flex items-start gap-4"><img src={business.logoUrl} alt={`Logo ${business.name}`} className="size-16 rounded-2xl border border-slate-100 bg-slate-50 object-cover" /><div className="min-w-0"><span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">{business.category}</span><h3 className="mt-2 truncate text-lg font-black text-slate-950">{business.name}</h3></div></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{business.description}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm"><span className="font-bold text-slate-600">{business.productCount} produk tersedia</span><span className="font-bold text-emerald-700 transition group-hover:translate-x-1">Lihat profil →</span></div></Link>)}</div><PaginationControls className="mt-6 rounded-3xl border border-slate-200 bg-white" page={currentPage} totalPages={totalPages} totalItems={catalog.length} pageSize={perPage} onPageChange={setPage} itemLabel="UMKM" /></section>
}
