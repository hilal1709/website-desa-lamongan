import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { hashPassword } from "@/lib/auth-password"

export const dynamic = "force-dynamic"

function staffInput(value: unknown, passwordRequired: boolean) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Data akun tidak valid.")
  const data = value as Record<string, unknown>
  const username = typeof data.username === "string" ? data.username.trim() : ""
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : ""
  const name = typeof data.name === "string" ? data.name.trim() : ""
  const password = typeof data.password === "string" ? data.password : ""
  if (!username || username.length > 80) throw new Error("Nama pengguna wajib diisi.")
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Email tidak valid.")
  if (!name || name.length > 120) throw new Error("Nama petugas wajib diisi.")
  if ((passwordRequired || password) && password.length < 8) throw new Error("Kata sandi minimal 8 karakter.")
  return { username, email, name, password: password || null, isActive: typeof data.isActive === "boolean" ? data.isActive : true }
}

async function requireAdmin() {
  const user = await getCurrentAdmin()
  return user?.role === "ADMIN" ? user : null
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 403 })
  const staff = await prisma.adminUser.findMany({ where: { role: "PETUGAS_PUSKESMAS" }, select: { id: true, username: true, email: true, name: true, isActive: true, createdAt: true, updatedAt: true }, orderBy: { createdAt: "desc" } })
  return Response.json({ staff })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return Response.json({ error: "Akses admin diperlukan." }, { status: 403 })
  try {
    const data = staffInput(await request.json(), true)
    const staff = await prisma.adminUser.create({ data: { username: data.username, email: data.email, name: data.name, passwordHash: await hashPassword(data.password!), role: "PETUGAS_PUSKESMAS", isActive: data.isActive }, select: { id: true, username: true, email: true, name: true, isActive: true, createdAt: true, updatedAt: true } })
    return Response.json(staff, { status: 201 })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Akun petugas tidak dapat dibuat." }, { status: 400 })
  }
}
