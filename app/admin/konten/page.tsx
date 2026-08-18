import { LazyCmsPageEditor } from "@/components/admin/lazy-cms-editors"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Konten halaman", "Kelola hero dan section halaman publik website desa.")

export default function KontenPage() {
  return <section data-admin-reveal aria-labelledby="konten-halaman-publik-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Konten" title="Konten halaman publik" description="Perbarui hero dan section halaman website desa." /><div className="mt-5"><LazyCmsPageEditor /></div></section>
}
