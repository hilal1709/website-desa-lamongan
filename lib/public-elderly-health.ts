import { prisma } from "@/app/lib/prisma"
import { ageInMonths } from "@/lib/child-health"
import { aggregateChildMeasurementTrend } from "@/lib/child-health"

export type PublicElderlyHealth = {
  elderly: { id: string; fullName: string; dusun: string; birthDate: string; diseases: string[] }[]
  diseaseSummary: { label: string; total: number }[]
  hamletSummary: { dusun: string; total: number }[]
  diseaseByHamlet: { disease: string; dusun: Record<string, number> }[]
  coverage: { withDisease: number; withoutDisease: number }
  posyandu: { nextSession: { name: string; sessionDate: string } | null; sessions: { id: string; name: string; sessionDate: string; attendance: number }[] }
  childPosyandu: { nextSession: { name: string; sessionDate: string } | null; sessions: { id: string; name: string; sessionDate: string; attendance: number }[] }
  children: { id: string; firstName: string; dusun: string; ageMonths: number }[]
  childDashboard: {
    metrics: { totalChildren: number; checkedChildren: number; attendanceRate: number; sessionCount: number }
    sessionAttendance: { id: string; name: string; sessionDate: string; attendance: number; total: number }[]
    measurementTrend: { month: string; weightKg: number; heightCm: number }[]
    developmentSummary: { label: string; total: number }[]
    interventionSummary: { label: string; total: number }[]
  }
}

export async function getPublicElderlyHealth(): Promise<PublicElderlyHealth> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [elderly, nextSession, sessions, children, activeChildren, childSessions, nextChildSession] = await Promise.all([prisma.elderly.findMany({
    where: { isActive: true },
    orderBy: [{ dusun: "asc" }, { fullName: "asc" }],
    select: { id: true, fullName: true, dusun: true, birthDate: true, diseases: { where: { endedAt: null }, select: { diseaseName: true, normalizedName: true } } },
  }), prisma.posyanduSession.findFirst({ where: { sessionDate: { gte: today } }, orderBy: { sessionDate: "asc" }, select: { name: true, sessionDate: true } }), prisma.posyanduSession.findMany({ orderBy: { sessionDate: "desc" }, take: 6, select: { id: true, name: true, sessionDate: true, _count: { select: { checks: true } } } }), prisma.child.findMany({ where: { isActive: true, publicProfileConsent: true }, orderBy: [{ dusun: "asc" }, { fullName: "asc" }], select: { id: true, fullName: true, dusun: true, birthDate: true } }), prisma.child.findMany({ where: { isActive: true }, select: { id: true } }), prisma.childPosyanduSession.findMany({ orderBy: { sessionDate: "desc" }, take: 12, select: { id: true, name: true, sessionDate: true } }), prisma.childPosyanduSession.findFirst({ where: { sessionDate: { gte: today } }, orderBy: { sessionDate: "asc" }, select: { name: true, sessionDate: true } })])
  const childChecks = childSessions.length ? await prisma.childHealthCheck.findMany({ where: { sessionId: { in: childSessions.map((session) => session.id) }, child: { isActive: true } }, select: { sessionId: true, childId: true, weightKg: true, heightCm: true, developmentStatus: true, interventions: true, session: { select: { sessionDate: true } } } }) : []
  const childSessionCounts = new Map<string, number>(); const developmentCounts = new Map<string, number>(); const interventionCounts = new Map<string, number>()
  for (const check of childChecks) { childSessionCounts.set(check.sessionId, (childSessionCounts.get(check.sessionId) ?? 0) + 1); if (check.developmentStatus) developmentCounts.set(check.developmentStatus, (developmentCounts.get(check.developmentStatus) ?? 0) + 1); for (const intervention of check.interventions) interventionCounts.set(intervention, (interventionCounts.get(intervention) ?? 0) + 1) }
  const diseaseCounts = new Map<string, { label: string; total: number }>()
  const diseaseByHamlet = new Map<string, Map<string, number>>()
  const hamletCounts = new Map<string, number>()
  let withDisease = 0
  const profiles = elderly.map((person) => {
    hamletCounts.set(person.dusun, (hamletCounts.get(person.dusun) ?? 0) + 1)
    if (person.diseases.length) withDisease += 1
    for (const disease of person.diseases) {
      const current = diseaseCounts.get(disease.normalizedName) ?? { label: disease.diseaseName, total: 0 }
      current.total += 1
      diseaseCounts.set(disease.normalizedName, current)
      const byHamlet = diseaseByHamlet.get(disease.normalizedName) ?? new Map<string, number>()
      byHamlet.set(person.dusun, (byHamlet.get(person.dusun) ?? 0) + 1)
      diseaseByHamlet.set(disease.normalizedName, byHamlet)
    }
    return { id: person.id, fullName: person.fullName, dusun: person.dusun, birthDate: person.birthDate.toISOString(), diseases: person.diseases.map((disease) => disease.diseaseName) }
  })
  return {
    elderly: profiles,
    diseaseSummary: [...diseaseCounts.values()].sort((left, right) => right.total - left.total || left.label.localeCompare(right.label, "id")).slice(0, 8),
    hamletSummary: [...hamletCounts.entries()].map(([dusun, total]) => ({ dusun, total })).sort((left, right) => left.dusun.localeCompare(right.dusun, "id")),
    diseaseByHamlet: [...diseaseCounts.entries()].map(([key, item]) => ({ disease: item.label, dusun: Object.fromEntries(diseaseByHamlet.get(key) ?? []) })).sort((left, right) => left.disease.localeCompare(right.disease, "id")).slice(0, 8),
    coverage: { withDisease, withoutDisease: profiles.length - withDisease },
    posyandu: { nextSession: nextSession ? { name: nextSession.name, sessionDate: nextSession.sessionDate.toISOString() } : null, sessions: sessions.map((session) => ({ id: session.id, name: session.name, sessionDate: session.sessionDate.toISOString(), attendance: session._count.checks })) },
    childPosyandu: { nextSession: nextChildSession ? { name: nextChildSession.name, sessionDate: nextChildSession.sessionDate.toISOString() } : null, sessions: [...childSessions].slice(0, 6).map((session) => ({ id: session.id, name: session.name, sessionDate: session.sessionDate.toISOString(), attendance: childSessionCounts.get(session.id) ?? 0 })) },
    children: children.map((child) => ({ id: child.id, firstName: child.fullName.trim().split(/\s+/)[0], dusun: child.dusun, ageMonths: ageInMonths(child.birthDate, today) })),
    childDashboard: {
      metrics: { totalChildren: activeChildren.length, checkedChildren: new Set(childChecks.map((check) => check.childId)).size, attendanceRate: activeChildren.length && childSessions.length ? Math.round((childChecks.length / (activeChildren.length * childSessions.length)) * 100) : 0, sessionCount: childSessions.length },
      sessionAttendance: [...childSessions].reverse().map((session) => ({ id: session.id, name: session.name, sessionDate: session.sessionDate.toISOString(), attendance: childSessionCounts.get(session.id) ?? 0, total: activeChildren.length })),
      measurementTrend: aggregateChildMeasurementTrend(childChecks.map((check) => ({ sessionDate: check.session.sessionDate, weightKg: check.weightKg, heightCm: check.heightCm }))),
      developmentSummary: [...developmentCounts.entries()].map(([label, total]) => ({ label, total })).sort((left, right) => right.total - left.total),
      interventionSummary: [...interventionCounts.entries()].map(([label, total]) => ({ label, total })).sort((left, right) => right.total - left.total),
    },
  }
}
