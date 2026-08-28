import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { publishCmsUpdate } from "@/lib/pusher"
export const dynamic = "force-dynamic"
export async function DELETE(_: Request, context: RouteContext<"/api/kesehatan/anak/sesi/[id]">) { const user = await getCurrentHealthUser(); if (!user) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 }); if (!user.isSuperAdmin) return Response.json({ error: "Hanya admin yang dapat menghapus sesi posyandu." }, { status: 403 }); try { const { id } = await context.params; await prisma.$transaction(async (tx) => { await tx.childHealthCheck.deleteMany({ where: { sessionId: id } }); await tx.childPosyanduSession.delete({ where: { id } }) }); await publishCmsUpdate("health-child"); return new Response(null, { status: 204 }) } catch { return Response.json({ error: "Sesi posyandu anak tidak ditemukan atau tidak dapat dihapus." }, { status: 404 }) } }
