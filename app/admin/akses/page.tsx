import { redirect } from "next/navigation"
import { AccessManager } from "@/components/admin/access-manager"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { prisma } from "@/app/lib/prisma"
import { cmsModules } from "@/lib/access-control"

export default async function AccessPage() {
  const user = await getCurrentAdmin()
  if (!user?.isSuperAdmin) redirect("/admin")
  const [users, roles] = await Promise.all([
    prisma.adminUser.findMany({ select: { id: true, username: true, email: true, name: true, isActive: true, isSuperAdmin: true, roles: { select: { roleId: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.role.findMany({ include: { permissions: true, _count: { select: { users: true } } }, orderBy: [{ isSystem: "desc" }, { name: "asc" }] }),
  ])
  const initialData = { modules: cmsModules.map(([id, label]) => ({ id, label })), roles, users }
  return <section className="py-1"><AdminPageHeader eyebrow="Keamanan CMS" title="Akun & Hak Akses" description="Kelola pengguna, peran kustom, dan izin setiap modul." /><div className="mt-6"><AccessManager initialData={initialData} /></div></section>
}
