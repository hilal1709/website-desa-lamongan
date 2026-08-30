import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { validatePosyanduCheckInput } from "@/lib/elderly-health"
import { publishCmsUpdate } from "@/lib/pusher"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const user = await getCurrentHealthUser("update")
  if (!user) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
  try {
    const data = validatePosyanduCheckInput(await request.json())
    const [session, elderly] = await Promise.all([
      prisma.posyanduSession.findUnique({ where: { id: data.sessionId }, select: { id: true } }),
      prisma.elderly.findUnique({ where: { id: data.elderlyId }, select: { id: true, isActive: true } }),
    ])
    if (!session) throw new Error("Sesi posyandu tidak ditemukan.")
    if (!elderly?.isActive) throw new Error("Data lansia tidak aktif atau tidak ditemukan.")
    const check = await prisma.posyanduCheck.upsert({
      where: { sessionId_elderlyId: { sessionId: data.sessionId, elderlyId: data.elderlyId } },
      create: { ...data, recordedById: user.id },
      update: { ...data, recordedById: user.id, recordedAt: new Date() },
      include: { recordedBy: { select: { name: true, username: true } } },
    })
    await publishCmsUpdate("health-elderly")
    return Response.json(check)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Pemeriksaan tidak dapat disimpan." }, { status: 400 })
  }
}
