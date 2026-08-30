import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { assertPasswordPolicy, hashPassword } from "@/lib/auth-password"
import { publishCmsUpdate } from "@/lib/pusher"
import { audit } from "@/lib/audit-log"
import { clientAddress } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function PATCH(request: Request, context: RouteContext<"/api/admin/akun-petugas/[id]">) {
  const current = await getCurrentAdmin()
  if (!current?.isSuperAdmin) return Response.json({ error: "Akses admin diperlukan." }, { status: 403 })
  try {
    const { id } = await context.params
    const body = await request.json() as Record<string, unknown>
    const username = typeof body.username === "string" ? body.username.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const password = typeof body.password === "string" ? body.password : ""
    if (!username || !name || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Data petugas tidak valid.")
    if (password) assertPasswordPolicy(password)
    const target = await prisma.adminUser.findFirst({ where: { id, roles: { some: { roleId: "system-health-staff" } } }, select: { id: true } })
    if (!target) return Response.json({ error: "Akun petugas tidak ditemukan." }, { status: 404 })
    const isActive = typeof body.isActive === "boolean" ? body.isActive : true
    const staff = await prisma.adminUser.update({ where: { id }, data: { username, email, name, isActive, ...(password ? { passwordHash: await hashPassword(password) } : {}) }, select: { id: true, username: true, email: true, name: true, isActive: true, createdAt: true, updatedAt: true } })
    if (!isActive || password) await prisma.adminSession.deleteMany({ where: { userId: id } })
    await audit("STAFF_ACCOUNT_UPDATED", "ADMIN_USER", { actorId: current.id, targetId: id, ip: clientAddress(request.headers) })
    await publishCmsUpdate("access")
    return Response.json(staff)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Akun petugas tidak dapat diperbarui." }, { status: 400 })
  }
}
