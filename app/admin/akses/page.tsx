import { redirect } from "next/navigation"
import dynamic from "next/dynamic"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { getCachedAdminAccessData } from "@/lib/admin-access-data"
import { canAccess, cmsAccessMatrix, firstPermittedCmsPath } from "@/lib/access-control"
import { createAdminMetadata } from "@/lib/admin-metadata"

const AccessManager = dynamic(() => import("@/components/admin/access-manager").then((module) => module.AccessManager), {
  loading: () => <div aria-busy="true" className="min-h-96 animate-pulse rounded-3xl border border-slate-200 bg-white" />,
})

export const metadata = createAdminMetadata("Akun & Hak Akses", "Kelola akun petugas, peran, dan izin modul CMS Desa Kedungrejo.")

export default async function AccessPage() {
  const user = await getCurrentAdmin()
  if (!user || !canAccess(user, "ACCOUNT_ACCESS")) redirect(user ? firstPermittedCmsPath(user) ?? "/login" : "/login")
  const { users, roles } = await getCachedAdminAccessData()
  const initialData = { modules: cmsAccessMatrix, roles, users }
  return <section aria-labelledby="akun-hak-akses-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="Keamanan CMS" title="Akun & Hak Akses" description="Kelola pengguna, peran kustom, dan izin setiap modul." /><div className="mt-5 sm:mt-6"><AccessManager initialData={initialData} /></div></section>
}
