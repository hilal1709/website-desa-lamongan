import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ArchiveManager } from "@/components/admin/archive-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { prisma } from "@/app/lib/prisma"

export const metadata = createAdminMetadata("Arsip dokumen", "Kelola dokumen arsip publik dan privat Desa Kedungrejo.")

export default async function AdminArchivePage() {
  const documents = await prisma.document.findMany({ orderBy: { uploadedAt: "desc" } })
  const initialDocuments = documents.map((document) => ({ ...document, uploadedAt: document.uploadedAt.toISOString() }))
  return <section data-admin-reveal className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Arsip" title="Arsip dokumen" description="Unggah dan kelola dokumen publik maupun privat." /><div className="mt-5"><ArchiveManager initialDocuments={initialDocuments} /></div></section>
}
