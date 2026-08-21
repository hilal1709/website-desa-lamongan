import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { aggregateMeasurementTrend, parseHealthFilters } from "@/lib/elderly-health"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  if (!(await getCurrentHealthUser())) return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
  try {
    const filters = parseHealthFilters(new URL(request.url).searchParams)
    const elderlyWhere: Prisma.ElderlyWhereInput = { isActive: true, ...(filters.dusun ? { dusun: filters.dusun } : {}) }
    const sessionWhere: Prisma.PosyanduSessionWhereInput = { ...(filters.from || filters.to ? { sessionDate: { ...(filters.from ? { gte: filters.from } : {}), ...(filters.to ? { lte: new Date(filters.to.getTime() + 86_399_999) } : {}) } } : {}) }
    const [elderly, sessions] = await Promise.all([
      prisma.elderly.findMany({ where: elderlyWhere, select: { id: true, dusun: true, diseases: { where: { endedAt: null }, select: { diseaseName: true, normalizedName: true } } } }),
      prisma.posyanduSession.findMany({ where: sessionWhere, orderBy: { sessionDate: "asc" }, select: { id: true, name: true, sessionDate: true } }),
    ])
    const checks = sessions.length ? await prisma.posyanduCheck.findMany({
      where: { sessionId: { in: sessions.map((session) => session.id) }, elderly: elderlyWhere },
      select: { sessionId: true, session: { select: { sessionDate: true } }, elderlyId: true, systolic: true, diastolic: true, weightKg: true, heightCm: true, bloodGlucoseMgDl: true },
    }) : []
    const diseaseNames = new Map<string, { label: string; total: number }>()
    const diseaseByDusun = new Map<string, Map<string, number>>()
    for (const person of elderly) for (const disease of person.diseases) {
      const summary = diseaseNames.get(disease.normalizedName) ?? { label: disease.diseaseName, total: 0 }
      summary.total += 1
      diseaseNames.set(disease.normalizedName, summary)
      const byDisease = diseaseByDusun.get(disease.normalizedName) ?? new Map<string, number>()
      byDisease.set(person.dusun, (byDisease.get(person.dusun) ?? 0) + 1)
      diseaseByDusun.set(disease.normalizedName, byDisease)
    }
    const sessionCounts = new Map<string, number>()
    for (const check of checks) sessionCounts.set(check.sessionId, (sessionCounts.get(check.sessionId) ?? 0) + 1)
    const checkedElderly = new Set(checks.map((check) => check.elderlyId)).size
    const diseaseTop = [...diseaseNames.values()].sort((left, right) => right.total - left.total || left.label.localeCompare(right.label, "id")).slice(0, 8)
    const diseaseDusun = [...diseaseNames.entries()].map(([key, value]) => ({ disease: value.label, total: value.total, dusun: Object.fromEntries(diseaseByDusun.get(key) ?? []) })).sort((left, right) => right.total - left.total || left.disease.localeCompare(right.disease, "id")).slice(0, 8)
    return Response.json({
      metrics: { totalElderly: elderly.length, checkedElderly, attendanceRate: elderly.length && sessions.length ? Math.round((checks.length / (elderly.length * sessions.length)) * 100) : 0, sessionCount: sessions.length },
      diseaseTop,
      diseaseDusun,
      sessionAttendance: sessions.map((session) => ({ id: session.id, name: session.name, date: session.sessionDate, checked: sessionCounts.get(session.id) ?? 0, total: elderly.length })),
      measurementTrend: aggregateMeasurementTrend(checks.map((check) => ({ ...check, sessionDate: check.session.sessionDate }))),
    })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Dashboard kesehatan belum dapat dimuat." }, { status: 400 })
  }
}
