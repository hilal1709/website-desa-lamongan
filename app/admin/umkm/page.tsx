import { Store } from "lucide-react"
import { LazyUmkmManager } from "@/components/admin/lazy-cms-editors"

export const metadata = { title: "Kelola UMKM | Admin Kedungrejo" }

export default function AdminUmkmPage() {
  return <section aria-labelledby="kelola-katalog-umkm-title" className="min-h-screen bg-slate-50 px-1 py-4 sm:px-3 sm:py-8 lg:px-5 lg:py-10"><div className="mx-auto max-w-5xl"><header className="rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-700 p-5 text-white shadow-lg shadow-emerald-900/15 sm:p-9"><span className="grid size-12 place-items-center rounded-2xl bg-white/15"><Store className="size-6" aria-hidden="true" /></span><h1 id="kelola-katalog-umkm-title" className="mt-5 text-2xl font-black sm:text-3xl">Kelola Katalog UMKM</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50">Input profil usaha, logo, produk, gambar, harga, dan nomor WhatsApp untuk ditampilkan di Infografis Desa.</p></header><section className="mt-5 sm:mt-7"><LazyUmkmManager /></section></div></section>
}
