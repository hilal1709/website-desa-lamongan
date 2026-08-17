"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, ChevronRight, FileText, LayoutDashboard, MessageSquare, Newspaper, Settings, ShieldAlert, ShieldCheck, type LucideIcon } from "lucide-react"

const menu: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: BarChart3, label: "Infografis", href: "/admin/infografis" },
  { icon: ShieldAlert, label: "Bencana & Cuaca", href: "/admin/bencana" },
  { icon: Newspaper, label: "Konten Halaman", href: "/admin/konten" },
  { icon: FileText, label: "Antrian Layanan", href: "/admin/antrian" },
  { icon: MessageSquare, label: "Modul CMS", href: "/admin/modul" },
  { icon: Settings, label: "Pengaturan", href: "/admin/pengaturan" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const isActive = (href: string) => {
    const target = href.split("?")[0]
    return target === "/admin" ? pathname === target : pathname.startsWith(target)
  }

  return <>
    <header className="mb-4 rounded-2xl border border-emerald-900/10 bg-slate-950 p-3.5 text-white shadow-md lg:hidden">
      <div className="flex items-center justify-between"><Link href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400 text-slate-950"><ShieldCheck className="h-5 w-5" /></span><span><b className="block text-xs font-black uppercase tracking-wider">CMS Desa</b><small className="text-slate-400">Kedungrejo</small></span></Link><Link href="/" className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-300">← Halaman Utama</Link></div>
      <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">{menu.map(({ icon: Icon, label, href }) => <Link key={href} href={href} className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold ${isActive(href) ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-slate-300"}`}><Icon className="h-3.5 w-3.5" />{label}</Link>)}</nav>
    </header>
    <aside className="sticky top-24 hidden h-[calc(100vh-120px)] rounded-[28px] border border-emerald-900/10 bg-slate-950 p-4 text-white shadow-xl shadow-emerald-950/10 lg:block">
      <Link href="/" className="flex items-center gap-3 rounded-2xl bg-white/6 p-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400 text-slate-950"><ShieldCheck className="h-5 w-5" /></span><span><b className="block text-sm font-black uppercase tracking-[0.16em]">CMS Desa</b><small className="text-slate-400">Kedungrejo</small></span></Link>
      <nav className="mt-6 space-y-1">{menu.map(({ icon: Icon, label, href }) => { const active = isActive(href); return <Link key={href} href={href} className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-bold transition ${active ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}><span className="flex items-center gap-3"><Icon className="h-4 w-4" />{label}</span>{active && <ChevronRight className="h-4 w-4" />}</Link> })}</nav>
      <div className="absolute inset-x-4 bottom-4 rounded-3xl border border-white/10 bg-white/6 p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Status sistem</p><p className="mt-2 text-sm font-semibold">Semua modul aktif</p><p className="mt-1 text-xs leading-5 text-slate-400">Data publik siap diperbarui oleh operator desa.</p></div>
    </aside>
  </>
}
