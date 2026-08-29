import dynamic from "next/dynamic"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { getAdminComplaints } from "@/lib/admin-complaint-data"

export const metadata = createAdminMetadata("Kelola aduan", "Tinjau dan tindak lanjuti aduan warga.")
const PAGE_SIZE = 12
const ComplaintManager = dynamic(() => import("@/components/admin/complaint-manager").then((module) => module.ComplaintManager), {
  loading: () => <div aria-busy="true" className="min-h-80 animate-pulse rounded-[28px] border border-slate-200 bg-white" />,
})

export default async function AduanAdminPage() {
  const initialData = await getAdminComplaints({ pageSize: PAGE_SIZE })
  return <section data-admin-reveal aria-labelledby="kelola-aduan-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="Layanan Desa" title="Kelola aduan" description="Tinjau laporan warga, beri tanggapan, dan perbarui status penanganannya." /><div className="mt-5"><ComplaintManager initialComplaints={initialData.complaints} initialPagination={initialData.pagination} initialStatusCounts={initialData.statusCounts} /></div></section>
}
