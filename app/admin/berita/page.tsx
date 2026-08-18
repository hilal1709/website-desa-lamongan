import { LazyNewsManager } from "@/components/admin/lazy-cms-editors"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Artikel berita desa", "Kelola kategori dan artikel berita yang akan ditampilkan kepada warga.")

export default function BeritaAdminPage() {
  return <section data-admin-reveal aria-labelledby="artikel-berita-desa-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Berita" title="Artikel berita desa" description="Tambah kategori dan kelola artikel yang akan ditampilkan kepada warga." /><div className="mt-5"><LazyNewsManager /></div></section>
}
