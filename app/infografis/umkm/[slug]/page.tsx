import Link from "next/link"
import { MapPin, MessageCircle, Store } from "lucide-react"
import { notFound } from "next/navigation"

import { UmkmOrderPanel } from "@/components/umkm/umkm-order-panel"
import { getCachedUmkmBySlug } from "@/lib/umkm"

export const dynamic = "force-dynamic"

export default async function UmkmProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const business = await getCachedUmkmBySlug(slug)
  if (!business) notFound()

  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-5 sm:py-12"><div className="mx-auto max-w-6xl"><Link href="/infografis?tab=umkm&section=katalog" className="inline-flex text-sm font-bold text-emerald-800 hover:text-emerald-950">← Kembali ke Katalog UMKM</Link><header className="mt-6 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-800 to-teal-800 p-6 text-white shadow-lg shadow-emerald-950/15 sm:p-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-start"><img src={business.logoUrl} alt={`Logo ${business.name}`} className="size-20 rounded-3xl border border-white/30 bg-white object-cover" /><div><span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{business.category}</span><h1 className="mt-3 text-3xl font-black sm:text-4xl">{business.name}</h1><p className="mt-3 max-w-2xl leading-7 text-emerald-50">{business.description}</p>{business.address && <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-100"><MapPin className="size-4" />{business.address}</p>}</div></div></header><section className="mt-8"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Katalog produk</p><h2 className="mt-1 text-2xl font-black text-slate-950">Pilih produk yang ingin dipesan</h2><p className="mt-2 text-sm leading-6 text-slate-600">Atur jumlah produk, lalu kirim rincian pesanan langsung ke WhatsApp {business.name}.</p></div><UmkmOrderPanel businessName={business.name} whatsapp={business.whatsapp} products={business.products} /></section><a href={`https://wa.me/${business.whatsapp.replace(/^0/, "62")}`} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-950"><MessageCircle className="size-4" />Hubungi {business.name} via WhatsApp</a></div></main>
}
