import { ChildHealthManager } from "@/components/anak/child-health-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { prisma } from "@/app/lib/prisma"
export const metadata = createAdminMetadata("Rekam Medis Anak & Balita", "Kelola rekam medis bayi, balita, dan posyandu KIA.")
export default async function AdminChildHealthPage() {
  const sessions = await prisma.childPosyanduSession.findMany({ orderBy: [{ sessionDate: "desc" }, { createdAt: "desc" }], take: 100, include: { _count: { select: { checks: true } } } })
  const sessionId = sessions[0]?.id
  const children = await prisma.child.findMany({ orderBy: [{ isActive: "desc" }, { fullName: "asc" }], include: { checks: sessionId ? { where: { sessionId }, select: { id: true, recordedAt: true, weightKg: true, heightCm: true, headCircumferenceCm: true, feeding: true, interventions: true, developmentStatus: true, notes: true, referral: true } } : false } })
  const initialSessions = sessions.map((session) => ({ ...session, sessionDate: session.sessionDate.toISOString() }))
  const initialChildren = children.map(({ checks, ...child }) => ({ ...child, birthDate: child.birthDate.toISOString(), checks: (checks || []).map((check) => ({ ...check, recordedAt: check.recordedAt.toISOString() })) }))
  return <ChildHealthManager canManageAccounts initialChildren={initialChildren} initialSessions={initialSessions} />
}
