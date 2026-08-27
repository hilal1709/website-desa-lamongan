import Link from "next/link"

import { AlertIcon, ChevronRight, FileIcon, MessageIcon, NewsIcon, StoreIcon } from "@/components/admin/dashboard-icons"
import { DashboardSectionHeading } from "@/components/admin/dashboard/section-heading"

const quickLinks = [
  { title: "Layanan & Pengajuan", description: "Kelola jenis layanan dan pengajuan administrasi warga.", href: "/admin/layanan", icon: FileIcon, accent: "bg-emerald-100 text-emerald-700" },
  { title: "Kelola Aduan", description: "Tinjau laporan warga dan perbarui penanganannya.", href: "/admin/aduan", icon: MessageIcon, accent: "bg-amber-100 text-amber-700" },
  { title: "Kelola Berita", description: "Tulis, simpan draft, dan publikasikan berita desa.", href: "/admin/berita", icon: NewsIcon, accent: "bg-sky-100 text-sky-700" },
  { title: "Kelola UMKM", description: "Atur profil usaha, produk, dan katalog UMKM.", href: "/admin/umkm", icon: StoreIcon, accent: "bg-violet-100 text-violet-700" },
  { title: "Status Bencana", description: "Kelola peringatan darurat dan kondisi cuaca.", href: "/admin/bencana", icon: AlertIcon, accent: "bg-rose-100 text-rose-700" },
  { title: "Tampilan Halaman", description: "Edit hero dan konten statis halaman publik.", href: "/admin/konten", icon: NewsIcon, accent: "bg-emerald-100 text-emerald-700" },
] as const

export function AdminQuickLinks() { return <section data-admin-reveal aria-labelledby="akses-cepat-title" className="mt-6"><DashboardSectionHeading eyebrow="Akses cepat" title="Modul pengelolaan" titleId="akses-cepat-title" /><nav aria-label="Akses cepat modul CMS" className="mt-4"><ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{quickLinks.map(({ icon: Icon, title, description, href, accent }) => <li key={title}><Link data-admin-card href={href} className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg"><span data-admin-card-icon className={`grid h-11 w-11 place-items-center rounded-xl ${accent}`}><Icon className="h-5 w-5" /></span><h3 className="mt-5 font-black text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-emerald-700">Buka modul <ChevronRight data-admin-card-arrow className="h-4 w-4" /></span></Link></li>)}</ul></nav></section> }
