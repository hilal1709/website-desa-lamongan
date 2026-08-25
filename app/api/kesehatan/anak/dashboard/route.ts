import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { aggregateChildMeasurementTrend } from "@/lib/child-health"
import { parseHealthFilters } from "@/lib/elderly-health"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!(await getCurrentHealthUser())) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
  try {
    const filters = parseHealthFilters(new URL(request.url).searchParams)
    const childWhere: Prisma.ChildWhereInput = { isActive: true, ...(filters.dusun ? { dusun: filters.dusun } : {}) }
    const sessionWhere: Prisma.ChildPosyanduSessionWhereInput = filters.from || filters.to ? { sessionDate: { ...(filters.from ? { gte: filters.from } : {}), ...(filters.to ? { lte: new Date(filters.to.getTime() + 86_399_999) } : {}) } } : {}
    const [children, sessions] = await Promise.all([prisma.child.findMany({ where: childWhere, select: { id: true } }), prisma.childPosyanduSession.findMany({ where: sessionWhere, orderBy: { sessionDate: "asc" }, select: { id: true, name: true, sessionDate: true } })])
    const checks = sessions.length ? await prisma.childHealthCheck.findMany({ where: { sessionId: { in: sessions.map((session) => session.id) }, child: childWhere }, select: { sessionId: true, childId: true, weightKg: true, heightCm: true, developmentStatus: true, interventions: true, session: { select: { sessionDate: true } } } }) : []
    const sessionCounts = new Map<string, number>(); const development = new Map<string, number>(); const interventions = new Map<string, number>()
    for (const check of checks) { sessionCounts.set(check.sessionId, (sessionCounts.get(check.sessionId) ?? 0) + 1); if (check.developmentStatus) development.set(check.developmentStatus, (development.get(check.developmentStatus) ?? 0) + 1); for (const item of check.interventions) interventions.set(item, (interventions.get(item) ?? 0) + 1) }
    const checkedChildren = new Set(checks.map((check) => check.childId)).size
    return Response.json({ metrics: { totalChildren: children.length, checkedChildren, attendanceRate: children.length && sessions.length ? Math.round((checks.length / (children.length * sessions.length)) * 100) : 0, sessionCount: sessions.length }, sessionAttendance: sessions.map((session) => ({ id: session.id, name: session.name, date: session.sessionDate, checked: sessionCounts.get(session.id) ?? 0, total: children.length })), measurementTrend: aggregateChildMeasurementTrend(checks.map((check) => ({ ...check, sessionDate: check.session.sessionDate }))), developmentSummary: [...development.entries()].map(([label, total]) => ({ label, total })).sort((a, b) => b.total - a.total), interventionSummary: [...interventions.entries()].map(([label, total]) => ({ label, total })).sort((a, b) => b.total - a.total) })
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Dashboard kesehatan anak belum dapat dimuat." }, { status: 400 }) }
}
