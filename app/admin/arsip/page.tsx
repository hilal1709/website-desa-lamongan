import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { LazyArchiveManager } from "@/components/admin/lazy-archive-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { getCachedAdminArchiveDocuments } from "@/lib/admin-archive-data"

export const metadata = createAdminMetadata("Arsip dokumen", "Kelola dokumen arsip publik dan privat Desa Kedungrejo.")

export default async function AdminArchivePage() {
  const documents = await getCachedAdminArchiveDocuments()
  const initialDocuments = documents.map((document) => ({ ...document, uploadedAt: new Date(document.uploadedAt).toISOString() }))
  return <section data-admin-reveal className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Arsip" title="Arsip dokumen" description="Unggah dan kelola dokumen publik maupun privat." /><div className="mt-5"><LazyArchiveManager initialDocuments={initialDocuments} /></div></section>
}
