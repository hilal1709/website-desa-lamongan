import { DataTable } from "@/components/ui/data-table"
import { getAdminDashboardData } from "@/lib/admin-data"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Antrian layanan", "Aduan warga dan draft berita yang membutuhkan tindak lanjut operator.")

export default async function AntrianPage() {
  const { queue } = await getAdminDashboardData()
  return <section data-admin-reveal aria-labelledby="antrian-layanan-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="Layanan Desa" title="Antrian layanan" /><section aria-labelledby="perhatian-operator-title" className="mt-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"><h2 id="perhatian-operator-title" className="text-xl font-black text-slate-950">Butuh perhatian operator</h2><div className="mt-5 overflow-x-auto"><DataTable rows={queue} emptyMessage="Tidak ada aduan atau draft berita yang perlu ditindaklanjuti." /></div></section></section>
}
