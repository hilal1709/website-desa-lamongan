import { LazyNewsManager } from "@/components/admin/lazy-cms-editors"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { getCmsNews } from "@/lib/news-cms"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { canAccess, firstPermittedCmsPath } from "@/lib/access-control"
import { redirect } from "next/navigation"

export const metadata = createAdminMetadata("Artikel berita desa", "Kelola kategori dan artikel berita yang akan ditampilkan kepada warga.")

export default async function BeritaAdminPage() {
  const user = await getCurrentAdmin()
  if (!user || !canAccess(user, "NEWS")) redirect(user ? firstPermittedCmsPath(user) ?? "/login" : "/login")
  const news = await getCmsNews()
  return <section data-admin-reveal aria-labelledby="artikel-berita-desa-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Berita" title="Artikel berita desa" description="Tambah kategori dan kelola artikel yang akan ditampilkan kepada warga." /><div className="mt-5"><LazyNewsManager initialData={news} /></div></section>
}
