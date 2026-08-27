import Link from "next/link"

import { AddIcon } from "@/components/admin/dashboard-icons"
import { Button } from "@/components/ui/button"

export function DashboardHero() {
  return <header data-admin-reveal className="relative overflow-hidden rounded-[28px] bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-950/15 sm:px-7 sm:py-7"><div data-admin-orb aria-hidden="true" className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-emerald-400/20 blur-2xl" /><div data-admin-orb-secondary aria-hidden="true" className="absolute -bottom-20 right-1/3 h-36 w-36 rounded-full bg-cyan-400/10 blur-2xl" /><div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-300">Dashboard CMS</p><h1 id="dashboard-cms-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Selamat datang, Operator.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Pantau layanan warga dan perbarui informasi desa dari satu ruang kerja.</p></div><Button asChild data-admin-action className="shrink-0 bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/15 hover:bg-emerald-300"><Link href="/admin/berita"><AddIcon />Tulis berita</Link></Button></div></header>
}
