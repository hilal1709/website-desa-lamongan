"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import type { ComponentType } from "react"
import { ArrowUpRight, BarChart3, ChevronRight, FileText, HeartPulse, LayoutDashboard, MessageSquare, Newspaper, Settings, ShieldAlert, Store } from "@/components/admin/dashboard-icons"
import { canAccess, type CurrentAdmin } from "@/lib/access-control"
import type { CmsModule } from "@/generated/prisma/client"

const menu: { icon: ComponentType<{ className?: string }>; label: string; href: string; module: CmsModule }[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", module: "DASHBOARD" }, { icon: BarChart3, label: "Infografis", href: "/admin/infografis", module: "INFOGRAPHICS" },
  { icon: HeartPulse, label: "Rekam Medis Lansia", href: "/admin/lansia", module: "ELDERLY_HEALTH" }, { icon: HeartPulse, label: "Rekam Medis Anak & Balita", href: "/admin/anak", module: "ELDERLY_HEALTH" }, { icon: Store, label: "UMKM", href: "/admin/umkm", module: "UMKM" }, { icon: ShieldAlert, label: "Bencana & Cuaca", href: "/admin/bencana", module: "DISASTER_WEATHER" },
  { icon: Newspaper, label: "Tampilan Halaman", href: "/admin/konten", module: "PAGE_CONTENT" }, { icon: Newspaper, label: "Kelola Berita", href: "/admin/berita", module: "NEWS" }, { icon: FileText, label: "Arsip Dokumen", href: "/admin/arsip", module: "DOCUMENT_ARCHIVE" },
  { icon: FileText, label: "Layanan & Pengajuan", href: "/admin/layanan", module: "SERVICE_CATALOG" }, { icon: MessageSquare, label: "Kelola Aduan", href: "/admin/aduan", module: "COMPLAINTS" }, { icon: Settings, label: "Pengaturan", href: "/admin/pengaturan", module: "SETTINGS" },
]

export function AdminSidebar({ user }: { user: CurrentAdmin }) {
  const pathname = usePathname()
  const permittedMenu = menu.filter((item) => canAccess(user, item.module))
  const isActive = (href: string) => {
    const target = href.split("?")[0]
    return target === "/admin" ? pathname === target : pathname.startsWith(target)
  }

  return <>
    <header className="mb-3 rounded-2xl border border-emerald-900/10 bg-slate-950 p-3 text-white shadow-md sm:mb-4 sm:p-3.5 lg:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/" className="flex min-w-0 items-center gap-2.5"><span className="flex h-9 w-[26px] shrink-0 items-center justify-center"><Image src="/images/logokedungrejo.png" alt="Lambang Desa Kedungrejo" width={26} height={36} className="h-auto w-full" /></span><span className="min-w-0"><b className="block text-xs font-black uppercase tracking-wider">CMS Desa</b><small className="text-slate-400">Kedungrejo</small></span></Link><Link href="/" className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-emerald-300">Web utama <ArrowUpRight className="size-3.5" aria-hidden="true" /></Link></div>
      <nav aria-label="Navigasi CMS" className="-mx-1 mt-3 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">{permittedMenu.map(({ icon: Icon, label, href }) => <Link key={href} href={href} className={`flex min-h-10 shrink-0 snap-start items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold ${isActive(href) ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-slate-300"}`}><Icon className="h-3.5 w-3.5" />{label}</Link>)}{user.isSuperAdmin ? <><Link href="/admin/akses" className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-slate-300"><Settings className="h-3.5 w-3.5" />Akun & Akses</Link><Link href="/admin/keamanan" className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-slate-300"><ShieldAlert className="h-3.5 w-3.5" />Keamanan akun</Link><Link href="/admin/audit-log" className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-slate-300"><ShieldAlert className="h-3.5 w-3.5" />Audit Log</Link></> : null}</nav>
    </header>
    <aside data-admin-sidebar className="hidden w-[280px] rounded-b-[28px] border border-emerald-900/10 bg-slate-950 p-4 text-white shadow-xl shadow-emerald-950/10 lg:fixed lg:inset-y-0 lg:left-[max(1.5rem,calc((100vw-1500px)/2))] lg:z-30 lg:flex lg:h-svh lg:flex-col">
      <Link href="/" className="flex items-center gap-3 rounded-2xl bg-white/6 p-3"><span className="flex h-11 w-[32px] shrink-0 items-center justify-center"><Image src="/images/logokedungrejo.png" alt="Lambang Desa Kedungrejo" width={32} height={45} className="h-auto w-full" /></span><span><b className="block text-sm font-black uppercase tracking-[0.16em]">CMS Desa</b><small className="text-slate-400">Kedungrejo</small></span></Link>
      <nav aria-label="Navigasi CMS" className="mt-6 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:rgba(148,163,184,.55)_transparent] [scrollbar-width:thin]">{permittedMenu.map(({ icon: Icon, label, href }) => { const active = isActive(href); return <Link data-admin-nav-item key={href} href={href} className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-bold transition ${active ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}><span className="flex items-center gap-3"><Icon className="h-4 w-4" />{label}</span>{active && <ChevronRight className="h-4 w-4" />}</Link> })}{user.isSuperAdmin ? <><Link data-admin-nav-item href="/admin/akses" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/8 hover:text-white"><Settings className="h-4 w-4" />Akun & Hak Akses</Link><Link data-admin-nav-item href="/admin/keamanan" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/8 hover:text-white"><ShieldAlert className="h-4 w-4" />Keamanan akun</Link><Link data-admin-nav-item href="/admin/audit-log" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/8 hover:text-white"><ShieldAlert className="h-4 w-4" />Audit Log</Link></> : null}</nav>
      <div className="mt-4 shrink-0 space-y-3"><Link href="/" className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300">Ke Web Utama <ArrowUpRight className="size-4" aria-hidden="true" /></Link><div className="rounded-3xl border border-white/10 bg-white/6 p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Status sistem</p><p className="mt-2 text-sm font-semibold">Semua modul aktif</p><p className="mt-1 text-xs leading-5 text-slate-400">Data publik siap diperbarui oleh operator desa.</p></div></div>
    </aside>
  </>
}
