"use client"

import { useMemo, useState } from "react"
import { Minus, PackageOpen, Plus, Send } from "lucide-react"
import type { UmkmProduct } from "@/types"
import { PaginationControls } from "@/components/ui/pagination-controls"

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })

export function UmkmOrderPanel({ businessName, whatsapp, products }: { businessName: string; whatsapp: string; products: UmkmProduct[] }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [page, setPage] = useState(1)
  const selected = useMemo(() => products.filter((item) => (quantities[item.id] ?? 0) > 0).map((item) => ({ ...item, quantity: quantities[item.id] })), [products, quantities])
  const total = selected.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const perPage = 8
  const totalPages = Math.max(1, Math.ceil(products.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const visibleProducts = products.slice((currentPage - 1) * perPage, currentPage * perPage)
  const change = (id: string, amount: number) => setQuantities((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + amount) }))
  const order = () => {
    const number = whatsapp.replace(/\D/g, "").replace(/^0/, "62")
    const lines = selected.map((item) => `- ${item.name} × ${item.quantity} = ${rupiah.format(item.price * item.quantity)}`)
    const message = [`Halo ${businessName}, saya ingin memesan:`, "", ...lines, "", `Total: ${rupiah.format(total)}`, "", "Mohon konfirmasi ketersediaan dan detail pengiriman. "].join("\n")
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
  }
  if (!products.length) return <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"><PackageOpen className="mx-auto size-9 text-slate-400" /><h2 className="mt-3 text-lg font-black text-slate-900">Produk belum tersedia</h2><p className="mt-2 text-sm text-slate-500">Silakan hubungi UMKM untuk informasi produk terbaru.</p></section>
  return <div className="grid gap-6 lg:grid-cols-[1fr_340px]"><section><div className="grid gap-4 sm:grid-cols-2">{visibleProducts.map((product) => <article key={product.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><img src={product.imageUrl} alt={product.name} className="aspect-[4/3] w-full bg-slate-100 object-cover" /><div className="p-5"><h2 className="font-black text-slate-950">{product.name}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{product.description}</p><p className="mt-4 text-lg font-black text-emerald-800">{rupiah.format(product.price)}</p><div className="mt-4 flex items-center justify-between"><span className="text-sm font-bold text-slate-600">Jumlah</span><div className="flex items-center gap-2"><button type="button" onClick={() => change(product.id, -1)} disabled={!quantities[product.id]} aria-label={`Kurangi ${product.name}`} className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-700 disabled:opacity-40"><Minus className="size-4" /></button><output className="w-6 text-center text-sm font-black text-slate-900">{quantities[product.id] ?? 0}</output><button type="button" onClick={() => change(product.id, 1)} aria-label={`Tambah ${product.name}`} className="grid size-9 place-items-center rounded-xl bg-emerald-700 text-white"><Plus className="size-4" /></button></div></div></div></article>)}</div><PaginationControls className="mt-5 rounded-3xl border border-slate-200 bg-white" page={currentPage} totalPages={totalPages} totalItems={products.length} pageSize={perPage} onPageChange={setPage} itemLabel="produk" /></section><aside className="h-fit rounded-3xl border border-emerald-200 bg-emerald-50 p-5 lg:sticky lg:top-24"><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Ringkasan pesanan</p><h2 className="mt-2 text-xl font-black text-emerald-950">Pesan via WhatsApp</h2>{selected.length ? <><ul className="mt-5 space-y-3 border-y border-emerald-200 py-4">{selected.map((item) => <li key={item.id} className="flex justify-between gap-3 text-sm"><span className="font-medium text-emerald-950">{item.name} × {item.quantity}</span><span className="shrink-0 font-bold text-emerald-900">{rupiah.format(item.price * item.quantity)}</span></li>)}</ul><div className="mt-4 flex items-center justify-between"><span className="font-bold text-emerald-900">Total</span><strong className="text-xl text-emerald-950">{rupiah.format(total)}</strong></div><button type="button" onClick={order} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"><Send className="size-4" />Pesan sekarang</button></> : <p className="mt-4 text-sm leading-6 text-emerald-900/75">Pilih jumlah produk yang ingin dipesan terlebih dahulu.</p>}</aside></div>
}
