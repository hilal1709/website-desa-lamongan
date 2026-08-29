import { ComplaintManager } from "@/components/admin/complaint-manager"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { prisma } from "@/app/lib/prisma"
import type { ComplaintStatus } from "@/lib/complaint-status"

export const metadata = createAdminMetadata("Kelola aduan", "Tinjau dan tindak lanjuti aduan warga.")
const PAGE_SIZE = 12

export default async function AduanAdminPage() {
  const [complaints, totalItems, groupedStatuses] = await Promise.all([
    prisma.complaint.findMany({ orderBy: { updatedAt: "desc" }, take: PAGE_SIZE }),
    prisma.complaint.count(),
    prisma.complaint.groupBy({ by: ["status"], _count: { _all: true } }),
  ])
  const initialComplaints = complaints.map((item) => ({ ...item, status: item.status as ComplaintStatus, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), respondedAt: item.respondedAt?.toISOString() ?? null }))
  const initialStatusCounts = Object.fromEntries(["Baru", "Diproses", "Selesai", "Ditutup"].map((status) => [status, groupedStatuses.find((group) => group.status === status)?._count._all ?? 0])) as Record<ComplaintStatus, number>
  return <section data-admin-reveal aria-labelledby="kelola-aduan-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="Layanan Desa" title="Kelola aduan" description="Tinjau laporan warga, beri tanggapan, dan perbarui status penanganannya." /><div className="mt-5"><ComplaintManager initialComplaints={initialComplaints} initialPagination={{ page: 1, pageSize: PAGE_SIZE, totalItems, totalPages: Math.max(1, Math.ceil(totalItems / PAGE_SIZE)) }} initialStatusCounts={initialStatusCounts} /></div></section>
}
