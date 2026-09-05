import { prisma } from "@/app/lib/prisma"
import { revalidateTag } from "next/cache"
import { requireCmsPermission } from "@/lib/api-access"
import { assertPasswordPolicy, hashPassword } from "@/lib/auth-password"
import { publishCmsUpdate } from "@/lib/pusher"
import { audit } from "@/lib/audit-log"
import { clientAddress } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

async function accountAccess(action: "update" | "delete") {
  return requireCmsPermission("ACCOUNT_ACCESS", action)
}

export async function PATCH(request: Request, context: RouteContext<"/api/admin/access/[id]">) {
  const access = await accountAccess("update"); if (access.response) return access.response
  try {
    const { id } = await context.params; const body = await request.json() as Record<string, unknown>
    if (body.kind === "role") {
      const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : ""; if (!name) throw new Error("Nama peran wajib diisi.")
      const permissions = Array.isArray(body.permissions) ? body.permissions : []
      const role = await prisma.role.update({ where: { id }, data: { name, description: typeof body.description === "string" ? body.description.trim().slice(0, 240) || null : null, permissions: { deleteMany: {}, create: permissions.map((item) => { const row = item as Record<string, unknown>; return { module: String(row.module) as never, canView: row.canView === true, canCreate: row.canCreate === true, canUpdate: row.canUpdate === true, canDelete: row.canDelete === true } }) } }, include: { permissions: true, _count: { select: { users: true } } } })
      await prisma.adminSession.deleteMany({ where: { user: { roles: { some: { roleId: id } } } } }); await audit("ROLE_UPDATED", "ROLE", { actorId: access.user!.id, targetId: id, ip: clientAddress(request.headers) }); revalidateTag("admin-access", { expire: 0 }); await publishCmsUpdate("access"); return Response.json({ role })
    }
    if (body.kind === "user") {
      const target = await prisma.adminUser.findUniqueOrThrow({ where: { id }, select: { isSuperAdmin: true } })
      if (target.isSuperAdmin) throw new Error("Akun superadmin hanya dapat dikelola oleh superadmin.")
      const roleIds = Array.isArray(body.roleIds) ? body.roleIds.filter((roleId): roleId is string => typeof roleId === "string") : []
      const password = typeof body.password === "string" ? body.password : ""
      if (password) assertPasswordPolicy(password)
      await prisma.adminUser.update({ where: { id }, data: { username: String(body.username ?? "").trim(), email: String(body.email ?? "").trim().toLowerCase(), name: String(body.name ?? "").trim(), isActive: body.isActive !== false, roles: { deleteMany: {}, create: roleIds.map((roleId) => ({ roleId })) }, ...(password ? { passwordHash: await hashPassword(password) } : {}) } })
      await prisma.adminSession.deleteMany({ where: { userId: id } }); await audit("ADMIN_ACCOUNT_UPDATED", "ADMIN_USER", { actorId: access.user!.id, targetId: id, ip: clientAddress(request.headers) }); revalidateTag("admin-access", { expire: 0 }); await publishCmsUpdate("access"); return Response.json({ ok: true })
    }
    throw new Error("Jenis data tidak valid.")
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Data tidak dapat diperbarui." }, { status: 400 }) }
}

export async function DELETE(request: Request, context: RouteContext<"/api/admin/access/[id]">) {
  const access = await accountAccess("delete"); if (access.response) return access.response
  const { id } = await context.params; const kind = new URL(request.url).searchParams.get("kind")
  if (kind === "role") { const role = await prisma.role.findUnique({ where: { id }, include: { _count: { select: { users: true } } } }); if (!role) return Response.json({ error: "Peran tidak ditemukan." }, { status: 404 }); if (role.isSystem || role._count.users) return Response.json({ error: "Peran sistem atau peran yang masih dipakai tidak dapat dihapus." }, { status: 400 }); await prisma.role.delete({ where: { id } }); await audit("ROLE_DELETED", "ROLE", { actorId: access.user!.id, targetId: id, ip: clientAddress(request.headers) }); revalidateTag("admin-access", { expire: 0 }); await publishCmsUpdate("access"); return new Response(null, { status: 204 }) }
  const user = await prisma.adminUser.findUnique({ where: { id } }); if (!user) return Response.json({ error: "Akun tidak ditemukan." }, { status: 404 }); if (user.isSuperAdmin) return Response.json({ error: "Akun superadmin tidak dapat dihapus." }, { status: 400 }); await prisma.adminUser.delete({ where: { id } }); await audit("ADMIN_ACCOUNT_DELETED", "ADMIN_USER", { actorId: access.user!.id, targetId: id, ip: clientAddress(request.headers) }); revalidateTag("admin-access", { expire: 0 }); await publishCmsUpdate("access"); return new Response(null, { status: 204 })
}
