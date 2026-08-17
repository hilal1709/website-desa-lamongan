import Link from "next/link"
import { BarChart3, ChevronRight, FileText, MessageSquare, Newspaper, ShieldAlert, Users, type LucideIcon } from "lucide-react"

export const metadata = { title: "CMS Admin | Kedungrejo" }

const stats: { icon: LucideIcon; value: string; label: string; change: string }[] = [
  { icon: FileText, value: "248", label: "Pengajuan layanan", change: "+12%" },
  { icon: MessageSquare, value: "12", label: "Aduan aktif", change: "4 prioritas" },
  { icon: Users, value: "4.862", label: "Warga terdata", change: "100%" },
  { icon: Newspaper, value: "18", label: "Konten publik", change: "6 draft" },
]
const modules = [
  { title: "Kelola Infografis", description: "Input data penduduk dan statistik desa.", href: "/admin/infografis", icon: BarChart3 },
  { title: "Kelola Status Bencana", description: "Atur peringatan darurat & status cuaca.", href: "/admin/bencana", icon: ShieldAlert },
  { title: "Konten Halaman", description: "Edit hero dan section halaman publik.", href: "/admin/konten", icon: Newspaper },
  { title: "Antrian Layanan", description: "Tinjau pekerjaan yang perlu ditangani.", href: "/admin/antrian", icon: FileText },
]

export default function Admin() {
  return <div className="py-1 sm:py-2">
    <p className="text-xs sm:text-sm font-bold uppercase tracking-[.18em] text-emerald-700">Dashboard CMS</p>
    <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">Kelola konten dan layanan desa.</h1>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ icon: Icon, value, label, change }) => <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-800"><Icon className="h-5 w-5" /></span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{change}</span></div><p className="mt-5 text-3xl font-black text-slate-950">{value}</p><p className="mt-1 text-sm font-bold text-slate-600">{label}</p></div>)}</div>
    <section className="mt-5"><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">Akses cepat</p><h2 className="mt-1 text-xl font-black text-slate-950">Modul pengelolaan CMS</h2></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{modules.map(({ icon: Icon, title, description, href }) => <Link key={title} href={href} className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-800"><Icon className="h-5 w-5" /></span><h3 className="mt-5 font-black text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-emerald-700">Buka modul <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>)}</div></section>
  </div>
}
