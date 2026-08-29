import { AdminPageHeader } from "@/components/admin/admin-page-header"
import dynamic from "next/dynamic"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { prisma } from "@/app/lib/prisma"
import { ensureDefaultVillageServices } from "@/lib/village-services"
import { STATUS_LABEL } from "@/lib/service-status"
import { getCachedAdminServiceCatalog } from "@/lib/admin-service-data"

const ServiceManager = dynamic(() => import("@/components/admin/service-manager").then((module) => module.ServiceManager), {
  loading: () => <div aria-busy="true" className="min-h-80 animate-pulse rounded-[28px] border border-slate-200 bg-white" />,
})

export const metadata = createAdminMetadata("Layanan & pengajuan", "Kelola katalog layanan administrasi dan pengajuan warga.")
export default async function AdminServicesPage() {
  await ensureDefaultVillageServices()
  const [services, submissions] = await Promise.all([getCachedAdminServiceCatalog(), prisma.serviceSubmission.findMany({ include: { service: { select: { title: true } }, attachments: { select: { id: true, filename: true } }, history: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { updatedAt: "desc" }, take: 100 })])
  const initialSubmissions = submissions.map(({ status, ...submission }) => ({ ...submission, status, statusLabel: STATUS_LABEL[status], createdAt: submission.createdAt.toISOString(), history: submission.history.map((item) => ({ note: item.note })) }))
  return <section className="py-1 sm:py-2"><AdminPageHeader eyebrow="Layanan Desa" title="Layanan & pengajuan" description="Atur layanan publik dan tindak lanjuti pengajuan warga." /><div className="mt-5"><ServiceManager initialServices={services} initialSubmissions={initialSubmissions} /></div></section>
}
