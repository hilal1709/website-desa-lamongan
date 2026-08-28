import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { validateChildInput } from "@/lib/child-health"
import { publishCmsUpdate } from "@/lib/pusher"

export const dynamic = "force-dynamic"
const pageSize = 9
const unauthorized = () => Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })

export async function GET(request: Request) {
  if (!(await getCurrentHealthUser())) return unauthorized()
  const params = new URL(request.url).searchParams
  const sessionId = params.get("sessionId")?.trim(); const search = params.get("search")?.trim(); const dusun = params.get("dusun")?.trim(); const all = params.get("all") === "true"; const requestedPage = Number.parseInt(params.get("page") ?? "1", 10); const safeRequestedPage = Number.isFinite(requestedPage) ? Math.max(requestedPage, 1) : 1
  const where: Prisma.ChildWhereInput = { ...(dusun ? { dusun } : {}), ...(search ? { fullName: { contains: search, mode: "insensitive" } } : {}) }
  const totalItems = await prisma.child.count({ where }); const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1); const page = all ? 1 : Math.min(safeRequestedPage, totalPages)
  const children = await prisma.child.findMany({ where, orderBy: [{ isActive: "desc" }, { fullName: "asc" }], ...(all ? {} : { skip: (page - 1) * pageSize, take: pageSize }), include: { checks: sessionId ? { where: { sessionId }, select: { id: true, recordedAt: true, updatedAt: true, weightKg: true, heightCm: true, headCircumferenceCm: true, feeding: true, interventions: true, developmentStatus: true, notes: true, referral: true } } : false } })
  return Response.json({ children: children.map(({ checks, ...child }) => ({ ...child, checks: checks || [] })), pagination: { page, pageSize, totalItems, totalPages } })
}

export async function POST(request: Request) {
  if (!(await getCurrentHealthUser())) return unauthorized()
  try { const child = await prisma.child.create({ data: validateChildInput(await request.json()), include: { checks: false } }); await publishCmsUpdate("health-child"); return Response.json(child, { status: 201 }) }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Data anak tidak valid." }, { status: 400 }) }
}
