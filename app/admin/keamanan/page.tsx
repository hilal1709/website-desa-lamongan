import { redirect } from "next/navigation"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { MfaSecurityManager } from "@/components/admin/mfa-security-manager"
import { getMfaEnrollmentAdmin } from "@/lib/admin-auth"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Keamanan akun", "Kelola verifikasi dua langkah untuk akun superadmin.")

export default async function SecurityPage() {
  const user = await getMfaEnrollmentAdmin()
  if (!user?.mfaRequired) redirect("/admin")
  const initialStatus = { enabled: Boolean(user.mfaEnabled), enabledAt: user.mfaEnabledAt ?? null, enrollmentDeadline: user.mfaEnrollmentDeadline ?? null, configured: Boolean(process.env.MFA_ENCRYPTION_KEY) }
  return <section data-admin-reveal className="py-1 sm:py-2"><AdminPageHeader eyebrow="Keamanan" title="Keamanan akun" description="Tambahkan verifikasi dua langkah berbasis aplikasi authenticator pada akun superadmin." /><MfaSecurityManager initialStatus={initialStatus} /></section>
}
