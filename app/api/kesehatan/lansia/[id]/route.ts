import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { validateElderlyUpdate } from "@/lib/elderly-health"

export const dynamic = "force-dynamic"

export async function PATCH(request: Request, context: RouteContext<"/api/kesehatan/lansia/[id]">) {
  if (!(await getCurrentHealthUser())) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
  try {
    const { id } = await context.params
    const data = validateElderlyUpdate(await request.json())
    const elderly = await prisma.$transaction(async (tx) => {
      const current = await tx.elderlyDisease.findMany({ where: { elderlyId: id, endedAt: null }, select: { id: true, normalizedName: true } })
      const desired = new Map(data.diseases.map((disease) => [disease.normalizedName, disease]))
      const toEnd = current.filter((disease) => !desired.has(disease.normalizedName)).map((disease) => disease.id)
      const existing = new Set(current.map((disease) => disease.normalizedName))
      if (toEnd.length) await tx.elderlyDisease.updateMany({ where: { id: { in: toEnd } }, data: { endedAt: new Date() } })
      const toCreate = data.diseases.filter((disease) => !existing.has(disease.normalizedName))
      if (toCreate.length) await tx.elderlyDisease.createMany({ data: toCreate.map((disease) => ({ ...disease, elderlyId: id })) })
      return tx.elderly.update({
        where: { id },
        data: { fullName: data.fullName, dusun: data.dusun, birthDate: data.birthDate, address: data.address, isActive: data.isActive },
        include: { diseases: { orderBy: { startedAt: "desc" } } },
      })
    })
    return Response.json(elderly)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Data lansia tidak dapat diperbarui." }, { status: 400 })
  }
}

export async function DELETE(_: Request, context: RouteContext<"/api/kesehatan/lansia/[id]">) {
  const user = await getCurrentHealthUser()
  if (!user) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
  if (user.role !== "ADMIN") return Response.json({ error: "Hanya admin yang dapat menghapus data lansia." }, { status: 403 })
  try {
    const { id } = await context.params
    await prisma.$transaction(async (tx) => {
      await tx.posyanduCheck.deleteMany({ where: { elderlyId: id } })
      await tx.elderlyDisease.deleteMany({ where: { elderlyId: id } })
      await tx.elderly.delete({ where: { id } })
    })
    return new Response(null, { status: 204 })
  } catch {
    return Response.json({ error: "Data lansia tidak ditemukan atau tidak dapat dihapus." }, { status: 404 })
  }
}
