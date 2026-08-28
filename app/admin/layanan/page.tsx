import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ServiceManager } from "@/components/admin/service-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { prisma } from "@/app/lib/prisma"
import { ensureDefaultVillageServices } from "@/lib/village-services"
import { STATUS_LABEL } from "@/lib/service-status"

export const metadata = createAdminMetadata("Layanan & pengajuan", "Kelola katalog layanan administrasi dan pengajuan warga.")
export default async function AdminServicesPage() {
  await ensureDefaultVillageServices()
  const [services, submissions] = await Promise.all([prisma.villageService.findMany({ include: { requirements: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } }), prisma.serviceSubmission.findMany({ include: { service: { select: { title: true } }, attachments: { select: { id: true, filename: true } }, history: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { updatedAt: "desc" }, take: 100 })])
  const initialSubmissions = submissions.map(({ status, ...submission }) => ({ ...submission, status, statusLabel: STATUS_LABEL[status], createdAt: submission.createdAt.toISOString(), history: submission.history.map((item) => ({ note: item.note })) }))
  return <section className="py-1 sm:py-2"><AdminPageHeader eyebrow="Layanan Desa" title="Layanan & pengajuan" description="Atur layanan publik dan tindak lanjuti pengajuan warga." /><div className="mt-5"><ServiceManager initialServices={services} initialSubmissions={initialSubmissions} /></div></section>
}
