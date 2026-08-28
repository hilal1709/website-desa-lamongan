import { cache } from "react"

import { prisma } from "@/app/lib/prisma"

// Request-scoped deduplication keeps sensitive health records out of a shared cache.
export const getInitialElderlyHealthData = cache(async () => {
  const sessions = await prisma.posyanduSession.findMany({ orderBy: [{ sessionDate: "desc" }, { createdAt: "desc" }], take: 100, include: { createdBy: { select: { name: true, username: true } }, _count: { select: { checks: true } } } })
  const sessionId = sessions[0]?.id
  const [people, totalItems] = await Promise.all([prisma.elderly.findMany({ orderBy: [{ isActive: "desc" }, { fullName: "asc" }], take: 9, include: { diseases: { orderBy: { startedAt: "desc" } }, checks: sessionId ? { where: { sessionId }, select: { id: true, recordedAt: true, updatedAt: true, systolic: true, diastolic: true, weightKg: true, heightCm: true, bloodGlucoseMgDl: true, notes: true } } : false } }), prisma.elderly.count()])
  return {
    initialSessions: sessions.map((session) => ({ ...session, sessionDate: session.sessionDate.toISOString() })),
    initialElderly: people.map(({ diseases, checks, ...person }) => ({ ...person, birthDate: person.birthDate.toISOString(), diseases: diseases.filter((item) => !item.endedAt).map((item) => ({ ...item, startedAt: item.startedAt.toISOString() })), diseaseHistory: diseases.map((item) => ({ ...item, startedAt: item.startedAt.toISOString(), endedAt: item.endedAt?.toISOString() ?? null })), checks: (checks || []).map((item) => ({ ...item, recordedAt: item.recordedAt.toISOString(), updatedAt: item.updatedAt.toISOString() })) })),
    initialPagination: { page: 1, pageSize: 9, totalItems, totalPages: Math.max(Math.ceil(totalItems / 9), 1) },
  }
})
