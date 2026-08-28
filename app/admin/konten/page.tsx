import { LazyCmsPageEditor } from "@/components/admin/lazy-cms-editors"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { getCmsPages } from "@/lib/cms-pages"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { canAccess, firstPermittedCmsPath } from "@/lib/access-control"
import { redirect } from "next/navigation"

export const metadata = createAdminMetadata("Tampilan Halaman", "Kelola konten statis pada halaman publik website desa.")

export default async function KontenPage() {
  const user = await getCurrentAdmin()
  if (!user || !canAccess(user, "PAGE_CONTENT")) redirect(user ? firstPermittedCmsPath(user) ?? "/login" : "/login")
  const pages = await getCmsPages()
  return <section data-admin-reveal aria-labelledby="tampilan-halaman-publik-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Konten" title="Tampilan Halaman" description="Atur konten statis yang tampil pada halaman publik website desa." /><div className="mt-5"><LazyCmsPageEditor initialPages={pages} /></div></section>
}
