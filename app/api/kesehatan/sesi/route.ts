import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { validatePosyanduSessionInput } from "@/lib/elderly-health"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!(await getCurrentHealthUser())) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
  const sessions = await prisma.posyanduSession.findMany({
    orderBy: [{ sessionDate: "desc" }, { createdAt: "desc" }],
    take: 100,
    include: { createdBy: { select: { name: true, username: true } }, _count: { select: { checks: true } } },
  })
  return Response.json({ sessions })
}

export async function POST(request: Request) {
  const user = await getCurrentHealthUser()
  if (!user) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
  try {
    const data = validatePosyanduSessionInput(await request.json())
    const session = await prisma.posyanduSession.create({ data: { ...data, createdById: user.id }, include: { createdBy: { select: { name: true, username: true } }, _count: { select: { checks: true } } } })
    return Response.json(session, { status: 201 })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Sesi posyandu tidak valid." }, { status: 400 })
  }
}
