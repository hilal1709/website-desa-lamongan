"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Boxes, CalendarDays, MapPinned, Package, Store, Tag, TrendingUp } from "lucide-react"
import type { UmkmCatalogItem, UmkmCategoryStat, UmkmPublicData } from "@/types"
import { PaginationControls } from "@/components/ui/pagination-controls"

const formatter = new Intl.NumberFormat("id-ID")

export function UmkmVisualization({ data }: { data: UmkmPublicData }) {
  const [dusun, setDusun] = useState("all")
  const [page, setPage] = useState(1)
  const filteredCatalog = useMemo(() => data.catalog.filter((business) => dusun === "all" || business.dusun === dusun), [data.catalog, dusun])
  const categories = useMemo(() => summarizeCategories(filteredCatalog), [filteredCatalog])
  const yearly = useMemo(() => summarizeYears(filteredCatalog), [filteredCatalog])
  const maximum = Math.max(...categories.map((item) => item.businesses), 1)
  const maximumTotal = Math.max(...yearly.map((item) => item.total), 1)
  const latest = yearly.at(-1)
  const perPage = 8
  const totalPages = Math.max(1, Math.ceil(filteredCatalog.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const visibleCatalog = filteredCatalog.slice((currentPage - 1) * perPage, currentPage * perPage)
  const filterLabel = dusun === "all" ? "semua dusun" : dusun
  const onDusun = (value: string) => { setDusun(value); setPage(1) }

  return <section className="mt-6" aria-label="Visualisasi UMKM"><div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm sm:flex sm:items-end sm:justify-between sm:gap-5 sm:p-5"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Filter visualisasi</p><h3 className="mt-1 text-lg font-black text-slate-900">Data UMKM menurut dusun</h3><p className="mt-1 text-sm text-slate-600">Grafik, ringkasan, dan tabel akan mengikuti dusun yang dipilih.</p></div><label className="mt-4 block text-sm font-bold text-slate-700 sm:mt-0 sm:w-72">Pilih dusun<select value={dusun} onChange={(event) => onDusun(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"><option value="all">Semua dusun</option>{data.hamlets.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={Store} label="UMKM aktif" value={filteredCatalog.length} /><Metric icon={Package} label="Produk tersedia" value={filteredCatalog.reduce((total, item) => total + item.productCount, 0)} /><Metric icon={Tag} label="Kategori usaha" value={categories.length} /><Metric icon={TrendingUp} label={latest ? `Pertambahan ${latest.year}` : "Pertambahan terbaru"} value={latest?.added ?? 0} prefix="+" /></div><div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Pertumbuhan UMKM</p><h3 className="mt-1 text-lg font-black text-slate-900">Total UMKM per tahun</h3><p className="mt-1 text-sm text-slate-500">Penambahan usaha tercatat di {filterLabel}; total dihitung secara kumulatif.</p></div>{yearly.length ? <div className="mt-7 flex min-h-56 items-end gap-3 overflow-x-auto pb-1">{yearly.map((item) => <div key={item.year} className="flex min-w-20 flex-1 flex-col items-center"><div className="mb-2 text-center"><p className="text-lg font-black text-slate-950">{formatter.format(item.total)}</p><p className="text-xs font-bold text-emerald-700">+{formatter.format(item.added)} baru</p></div><div className="flex h-32 w-full items-end rounded-t-2xl bg-emerald-50 px-1"><div className="w-full rounded-t-xl bg-gradient-to-t from-emerald-700 to-teal-400 transition-all" style={{ height: `${Math.max((item.total / maximumTotal) * 100, 10)}%` }} aria-label={`${item.year}: total ${item.total} UMKM, bertambah ${item.added}`} /></div><p className="mt-2 text-sm font-bold text-slate-600">{item.year}</p></div>)}</div> : <Empty message="Belum ada data UMKM pada dusun ini." />}</article><article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Sebaran usaha</p><h3 className="mt-1 text-lg font-black text-slate-900">UMKM menurut kategori</h3><p className="mt-1 text-sm text-slate-500">Jumlah pelaku usaha dan produk aktif per kategori.</p></div>{categories.length ? <div className="mt-6 space-y-4">{categories.map((item) => <div key={item.category}><div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-sm"><span className="font-bold text-slate-800">{item.category}</span><span className="text-slate-500">{formatter.format(item.businesses)} UMKM · {formatter.format(item.products)} produk</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500" style={{ width: `${(item.businesses / maximum) * 100}%` }} /></div></div>)}</div> : <Empty message="Belum ada data kategori pada dusun ini." />}</article></div><article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3 p-5"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Rincian UMKM</p><h3 className="mt-1 text-lg font-black text-slate-900">Daftar usaha {dusun === "all" ? "desa" : dusun}</h3><p className="mt-1 text-sm text-slate-500">{formatter.format(filteredCatalog.length)} UMKM sesuai filter.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800"><MapPinned className="size-4" />{filterLabel}</span></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">UMKM</th><th className="px-5 py-3">Dusun</th><th className="px-5 py-3">Kategori</th><th className="px-5 py-3">Tahun dicatat</th><th className="px-5 py-3 text-right">Produk</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleCatalog.map((business) => <tr key={business.id} className="transition hover:bg-emerald-50/40"><td className="px-5 py-4"><Link href={`/infografis/umkm/${business.slug}`} prefetch={false} className="font-bold text-slate-950 hover:text-emerald-700">{business.name}</Link></td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{business.dusun}</td><td className="whitespace-nowrap px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{business.category}</span></td><td className="whitespace-nowrap px-5 py-4 text-slate-600"><span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-emerald-700" />{new Date(business.registeredAt).getUTCFullYear()}</span></td><td className="px-5 py-4 text-right font-bold text-slate-800">{business.productCount}</td></tr>)}{!visibleCatalog.length ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm font-medium text-slate-500">Belum ada UMKM yang sesuai dengan filter ini.</td></tr> : null}</tbody></table></div><PaginationControls className="m-4 rounded-2xl border border-slate-100" page={currentPage} totalPages={totalPages} totalItems={filteredCatalog.length} pageSize={perPage} onPageChange={setPage} itemLabel="UMKM" /></article></section>
}

function summarizeCategories(catalog: UmkmCatalogItem[]): UmkmCategoryStat[] {
  const categories = new Map<string, UmkmCategoryStat>()
  for (const business of catalog) {
    const key = business.category.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID")
    const item = categories.get(key) ?? { category: business.category.trim(), businesses: 0, products: 0 }
    item.businesses += 1
    item.products += business.productCount
    categories.set(key, item)
  }
  return [...categories.values()].sort((a, b) => b.businesses - a.businesses || a.category.localeCompare(b.category, "id"))
}

function summarizeYears(catalog: UmkmCatalogItem[]) {
  const additions = new Map<number, number>()
  for (const business of catalog) {
    const year = new Date(business.registeredAt).getUTCFullYear()
    additions.set(year, (additions.get(year) ?? 0) + 1)
  }
  let total = 0
  return [...additions.entries()].sort(([a], [b]) => a - b).map(([year, added]) => ({ year, added, total: total += added }))
}

function Empty({ message }: { message: string }) { return <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">{message}</p> }

function Metric({ icon: Icon, label, value, prefix = "" }: { icon: typeof Store; label: string; value: number; prefix?: string }) {
  return <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"><span className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-800"><Icon className="size-5" /></span><p className="mt-4 text-3xl font-black text-slate-950">{prefix}{formatter.format(value)}</p><p className="mt-1 text-sm font-bold text-slate-600">{label}</p></article>
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
