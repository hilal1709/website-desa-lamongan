import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { validateChildInput } from "@/lib/child-health"

export const dynamic = "force-dynamic"
const unauthorized = () => Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })

export async function GET(request: Request) {
  if (!(await getCurrentHealthUser())) return unauthorized()
  const params = new URL(request.url).searchParams
  const sessionId = params.get("sessionId")?.trim(); const search = params.get("search")?.trim(); const dusun = params.get("dusun")?.trim()
  const where: Prisma.ChildWhereInput = { ...(dusun ? { dusun } : {}), ...(search ? { fullName: { contains: search, mode: "insensitive" } } : {}) }
  const children = await prisma.child.findMany({ where, orderBy: [{ isActive: "desc" }, { fullName: "asc" }], include: { checks: sessionId ? { where: { sessionId }, select: { id: true, recordedAt: true, updatedAt: true, weightKg: true, heightCm: true, headCircumferenceCm: true, feeding: true, interventions: true, developmentStatus: true, notes: true, referral: true } } : false } })
  return Response.json({ children: children.map(({ checks, ...child }) => ({ ...child, checks: checks || [] })) })
}

export async function POST(request: Request) {
  if (!(await getCurrentHealthUser())) return unauthorized()
  try { return Response.json(await prisma.child.create({ data: validateChildInput(await request.json()), include: { checks: false } }), { status: 201 }) }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Data anak tidak valid." }, { status: 400 }) }
}
