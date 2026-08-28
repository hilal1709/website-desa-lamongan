import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { validateChildUpdate } from "@/lib/child-health"
import { publishCmsUpdate } from "@/lib/pusher"

export const dynamic = "force-dynamic"
export async function PATCH(request: Request, context: RouteContext<"/api/kesehatan/anak/[id]">) {
  if (!(await getCurrentHealthUser())) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
  try { const { id } = await context.params; const child = await prisma.child.update({ where: { id }, data: validateChildUpdate(await request.json()) }); await publishCmsUpdate("health-child"); return Response.json(child) }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Data anak tidak dapat diperbarui." }, { status: 400 }) }
}
export async function DELETE(_: Request, context: RouteContext<"/api/kesehatan/anak/[id]">) {
  const user = await getCurrentHealthUser()
  if (!user) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
  if (!user.isSuperAdmin) return Response.json({ error: "Hanya admin yang dapat menghapus data anak." }, { status: 403 })
  try { const { id } = await context.params; await prisma.$transaction(async (tx) => { await tx.childHealthCheck.deleteMany({ where: { childId: id } }); await tx.child.delete({ where: { id } }) }); await publishCmsUpdate("health-child"); return new Response(null, { status: 204 }) }
  catch { return Response.json({ error: "Data anak tidak ditemukan atau tidak dapat dihapus." }, { status: 404 }) }
}
