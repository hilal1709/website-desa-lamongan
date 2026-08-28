import { cache } from "react"

import { prisma } from "@/app/lib/prisma"

// Request-scoped deduplication only: sensitive health records are never shared across users.
export const getInitialChildHealthData = cache(async () => {
  const sessionsPromise = prisma.childPosyanduSession.findMany({ orderBy: [{ sessionDate: "desc" }, { createdAt: "desc" }], take: 100, include: { _count: { select: { checks: true } } } })
  const totalItemsPromise = prisma.child.count()
  const sessions = await sessionsPromise
  const sessionId = sessions[0]?.id
  const children = await prisma.child.findMany({ orderBy: [{ isActive: "desc" }, { fullName: "asc" }], take: 9, include: { checks: sessionId ? { where: { sessionId }, select: { id: true, recordedAt: true, weightKg: true, heightCm: true, feeding: true, interventions: true, developmentStatus: true, notes: true, referral: true } } : false } })
  const totalItems = await totalItemsPromise
  return {
    initialSessions: sessions.map((session) => ({ ...session, sessionDate: session.sessionDate.toISOString() })),
    initialChildren: children.map(({ checks, ...child }) => ({ ...child, birthDate: child.birthDate.toISOString(), checks: (checks || []).map((check) => ({ ...check, recordedAt: check.recordedAt.toISOString() })) })),
    initialPagination: { page: 1, pageSize: 9, totalItems, totalPages: Math.max(Math.ceil(totalItems / 9), 1) },
  }
})
