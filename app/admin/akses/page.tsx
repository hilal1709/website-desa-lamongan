import { redirect } from "next/navigation"
import { AccessManager } from "@/components/admin/access-manager"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { getCurrentAdmin } from "@/lib/admin-auth"

export default async function AccessPage() {
  const user = await getCurrentAdmin()
  if (!user?.isSuperAdmin) redirect("/admin")
  return <section className="py-1"><AdminPageHeader eyebrow="Keamanan CMS" title="Akun & Hak Akses" description="Kelola pengguna, peran kustom, dan izin setiap modul." /><div className="mt-6"><AccessManager /></div></section>
}
