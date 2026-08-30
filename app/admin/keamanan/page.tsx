import { redirect } from "next/navigation"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { MfaSecurityManager } from "@/components/admin/mfa-security-manager"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Keamanan akun", "Kelola verifikasi dua langkah untuk akun superadmin.")

export default async function SecurityPage() {
  const user = await getCurrentAdmin({ allowMfaEnrollment: true })
  if (!user?.mfaRequired) redirect("/admin")
  return <section data-admin-reveal className="py-1 sm:py-2"><AdminPageHeader eyebrow="Keamanan" title="Keamanan akun" description="Tambahkan verifikasi dua langkah berbasis aplikasi authenticator pada akun superadmin." /><MfaSecurityManager /></section>
}
