import { ComplaintManager } from "@/components/admin/complaint-manager"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { prisma } from "@/app/lib/prisma"
import type { ComplaintStatus } from "@/lib/complaint-status"

export const metadata = createAdminMetadata("Kelola aduan", "Tinjau dan tindak lanjuti aduan warga.")

export default async function AduanAdminPage() {
  const complaints = await prisma.complaint.findMany({ orderBy: { updatedAt: "desc" }, take: 100 })
  const initialComplaints = complaints.map((item) => ({ ...item, status: item.status as ComplaintStatus, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), respondedAt: item.respondedAt?.toISOString() ?? null }))
  return <section data-admin-reveal aria-labelledby="kelola-aduan-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="Layanan Desa" title="Kelola aduan" description="Tinjau laporan warga, beri tanggapan, dan perbarui status penanganannya." /><div className="mt-5"><ComplaintManager initialComplaints={initialComplaints} /></div></section>
}
