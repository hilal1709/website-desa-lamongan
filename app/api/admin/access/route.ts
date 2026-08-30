import { prisma } from "@/app/lib/prisma"
import { revalidateTag } from "next/cache"
import { requireCmsPermission } from "@/lib/api-access"
import { getCachedAdminAccessData } from "@/lib/admin-access-data"
import { cmsAccessMatrix, cmsModules } from "@/lib/access-control"
import { assertPasswordPolicy, hashPassword } from "@/lib/auth-password"
import { publishCmsUpdate } from "@/lib/pusher"
import { audit } from "@/lib/audit-log"
import { clientAddress } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : ""
const validModules = new Set(cmsModules.map(([module]) => module))

function permissions(value: unknown) {
  if (!Array.isArray(value)) throw new Error("Daftar izin tidak valid.")
  return value.map((item) => {
    if (!item || typeof item !== "object") throw new Error("Izin tidak valid.")
    const row = item as Record<string, unknown>
    if (typeof row.module !== "string" || !validModules.has(row.module as never)) throw new Error("Modul tidak valid.")
    return { module: row.module as (typeof cmsModules)[number][0], canView: row.canView === true, canCreate: row.canCreate === true, canUpdate: row.canUpdate === true, canDelete: row.canDelete === true }
  })
}

async function superadmin() {
  const result = await requireCmsPermission("SETTINGS", "delete")
  if (result.response) return result
  return result.user?.isSuperAdmin ? result : { user: null, response: Response.json({ error: "Hanya superadmin yang dapat mengelola akun dan peran." }, { status: 403 }) }
}

export async function GET() {
  const { response } = await superadmin(); if (response) return response
  const { users, roles } = await getCachedAdminAccessData()
  return Response.json({ modules: cmsAccessMatrix, users, roles })
}

export async function POST(request: Request) {
  const access = await superadmin(); if (access.response) return access.response
  try {
    const body = await request.json() as Record<string, unknown>
    if (body.kind === "role") {
      const name = text(body.name, 80); if (!name) throw new Error("Nama peran wajib diisi.")
      const created = await prisma.role.create({ data: { name, description: text(body.description, 240) || null, permissions: { create: permissions(body.permissions) } }, include: { permissions: true, _count: { select: { users: true } } } })
      await audit("ROLE_CREATED", "ROLE", { actorId: access.user!.id, targetId: created.id, ip: clientAddress(request.headers) })
      revalidateTag("admin-access", { expire: 0 }); await publishCmsUpdate("access")
      return Response.json({ role: created }, { status: 201 })
    }
    if (body.kind === "user") {
      const username = text(body.username, 80), email = text(body.email, 160).toLowerCase(), name = text(body.name, 120), password = typeof body.password === "string" ? body.password : ""
      const roleIds = Array.isArray(body.roleIds) ? body.roleIds.filter((id): id is string => typeof id === "string") : []
      if (!username || !name || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Data akun tidak valid.")
      assertPasswordPolicy(password)
      const user = await prisma.adminUser.create({ data: { username, email, name, passwordHash: await hashPassword(password), isActive: body.isActive !== false, roles: { create: roleIds.map((roleId) => ({ role: { connect: { id: roleId } } })) } }, select: { id: true, username: true } })
      await audit("ADMIN_ACCOUNT_CREATED", "ADMIN_USER", { actorId: access.user!.id, targetId: user.id, ip: clientAddress(request.headers) })
      revalidateTag("admin-access", { expire: 0 }); await publishCmsUpdate("access")
      return Response.json({ user }, { status: 201 })
    }
    throw new Error("Jenis data tidak valid.")
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Data tidak dapat disimpan." }, { status: 400 }) }
}
