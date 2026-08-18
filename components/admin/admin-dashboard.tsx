import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminMetricGrid, AdminQuickLinks } from "@/components/admin/admin-dashboard-panels"
import type { AdminMetric } from "@/lib/admin-data"

export function AdminDashboard({ metrics, updatedAt }: { metrics: AdminMetric[]; updatedAt: string | null }) {
  return <section aria-labelledby="dashboard-cms-title" className="py-1 sm:py-2">
    <header data-admin-reveal className="relative overflow-hidden rounded-[28px] bg-slate-950 px-5 py-6 text-white shadow-xl shadow-slate-950/15 sm:px-7 sm:py-7">
      <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-emerald-400/20 blur-2xl" />
      <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-300">Dashboard CMS</p><h1 id="dashboard-cms-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Selamat datang, Operator.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Pantau layanan warga dan perbarui informasi desa dari satu ruang kerja.</p></div>
        <Button asChild className="shrink-0 bg-emerald-400 text-slate-950 hover:bg-emerald-300"><Link href="/admin/berita"><Plus aria-hidden="true" />Tulis berita</Link></Button>
      </div>
    </header>
    <AdminMetricGrid metrics={metrics} />
    {updatedAt ? <p data-admin-reveal className="mt-3 text-xs font-medium text-slate-500">Data CMS terakhir diperbarui: {updatedAt}</p> : null}
    <AdminQuickLinks />
  </section>
}
