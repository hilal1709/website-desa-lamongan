import { Settings } from "lucide-react"
import { getAdminDashboardData } from "@/lib/admin-data"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Pengaturan sistem", "Tinjau status dan pembaruan data CMS Desa Kedungrejo.")

export default async function PengaturanPage() {
  const { metrics, updatedAt } = await getAdminDashboardData()
  return <section data-admin-reveal aria-labelledby="pengaturan-sistem-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Desa" title="Pengaturan sistem" /><section aria-labelledby="status-data-cms-title" className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"><Settings className="h-7 w-7 text-emerald-700" aria-hidden="true" /><h2 id="status-data-cms-title" className="mt-4 text-xl font-black text-slate-950">Status data CMS</h2><p className="mt-2 text-sm leading-6 text-slate-600">{updatedAt ? `Pembaruan konten terakhir: ${updatedAt}.` : "Belum ada pembaruan konten yang tersimpan."}</p><dl className="mt-5 grid gap-3 sm:grid-cols-2">{metrics.map((metric) => <div key={metric.key} className="rounded-2xl bg-slate-50 p-4"><dd className="text-2xl font-black text-slate-950">{metric.value}</dd><dt className="mt-1 text-sm font-bold text-slate-700">{metric.label}</dt><p className="mt-1 text-xs text-slate-500">{metric.detail}</p></div>)}</dl></section></section>
}
