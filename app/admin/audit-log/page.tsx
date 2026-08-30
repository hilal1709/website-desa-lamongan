import { redirect } from "next/navigation"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { getCachedAdminAuditLog } from "@/lib/admin-audit-data"
import { AuditLogTable } from "@/components/admin/audit-log-table"

export const metadata = createAdminMetadata("Audit Log", "Riwayat aktivitas keamanan CMS.")

export default async function AuditLogPage({ searchParams }: PageProps<"/admin/audit-log">) {
  const user = await getCurrentAdmin(); if (!user?.isSuperAdmin) redirect("/admin")
  const page = Math.max(1, Number((await searchParams).page) || 1), take = 20
  const { rows, total } = await getCachedAdminAuditLog(page, take)
  return <section aria-labelledby="audit-log-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="Keamanan CMS" title="Audit Log" description="Riwayat aktivitas keamanan tanpa menyimpan kredensial atau data warga." /><div className="mt-5 sm:mt-6"><AuditLogTable rows={rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }))} page={page} total={total} pageSize={take} /></div></section>
}
