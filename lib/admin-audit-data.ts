import { unstable_cache } from "next/cache"
import { prisma } from "@/app/lib/prisma"

const auditLogSelect = {
  id: true,
  actorId: true,
  action: true,
  resource: true,
  targetId: true,
  createdAt: true,
} as const

export type AdminAuditLogPage = Awaited<ReturnType<typeof readAuditLogPage>>

async function readAuditLogPage(page: number, pageSize: number) {
  const skip = (page - 1) * pageSize
  const [rows, total] = await Promise.all([
    prisma.auditLog.findMany({ select: auditLogSelect, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    prisma.auditLog.count(),
  ])
  return { rows, total }
}

export function getCachedAdminAuditLog(page: number, pageSize: number) {
  return unstable_cache(
    () => readAuditLogPage(page, pageSize),
    ["admin-audit-log-v1", String(page), String(pageSize)],
    { revalidate: 60, tags: ["admin-audit-log"] },
  )()
}
