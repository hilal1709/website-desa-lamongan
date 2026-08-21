import { prisma } from "@/app/lib/prisma"

export type PublicElderlyHealth = {
  elderly: { id: string; fullName: string; dusun: string; birthDate: string; diseases: string[] }[]
  diseaseSummary: { label: string; total: number }[]
  hamletSummary: { dusun: string; total: number }[]
  diseaseByHamlet: { disease: string; dusun: Record<string, number> }[]
  coverage: { withDisease: number; withoutDisease: number }
  posyandu: { nextSession: { name: string; sessionDate: string } | null; sessions: { id: string; name: string; sessionDate: string; attendance: number }[] }
}

export async function getPublicElderlyHealth(): Promise<PublicElderlyHealth> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [elderly, nextSession, sessions] = await Promise.all([prisma.elderly.findMany({
    where: { isActive: true },
    orderBy: [{ dusun: "asc" }, { fullName: "asc" }],
    select: { id: true, fullName: true, dusun: true, birthDate: true, diseases: { where: { endedAt: null }, select: { diseaseName: true, normalizedName: true } } },
  }), prisma.posyanduSession.findFirst({ where: { sessionDate: { gte: today } }, orderBy: { sessionDate: "asc" }, select: { name: true, sessionDate: true } }), prisma.posyanduSession.findMany({ orderBy: { sessionDate: "desc" }, take: 6, select: { id: true, name: true, sessionDate: true, _count: { select: { checks: true } } } })])
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
  }
}
