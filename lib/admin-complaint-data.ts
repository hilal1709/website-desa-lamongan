import { unstable_cache } from "next/cache"

import { prisma } from "@/app/lib/prisma"
import { COMPLAINT_STATUSES, type ComplaintStatus } from "@/lib/complaint-status"

export type AdminComplaintQuery = { page?: number; pageSize?: number; status?: string; category?: string; search?: string }

async function readAdminComplaints({ page = 1, pageSize = 12, status, category, search }: AdminComplaintQuery) {
  const where = {
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(search ? { OR: [{ title: { contains: search, mode: "insensitive" as const } }, { location: { contains: search, mode: "insensitive" as const } }, { contact: { contains: search, mode: "insensitive" as const } }] } : {}),
  }
  const [totalItems, groupedStatuses] = await Promise.all([
    prisma.complaint.count({ where }),
    prisma.complaint.groupBy({ by: ["status"], where, _count: { _all: true } }),
  ])
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const complaints = await prisma.complaint.findMany({ where, orderBy: { updatedAt: "desc" }, skip: (currentPage - 1) * pageSize, take: pageSize })
  const statusCounts = Object.fromEntries(COMPLAINT_STATUSES.map((item) => [item, groupedStatuses.find((group) => group.status === item)?._count._all ?? 0])) as Record<ComplaintStatus, number>

  return {
    complaints: complaints.map((item) => ({ ...item, status: item.status as ComplaintStatus, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), respondedAt: item.respondedAt?.toISOString() ?? null })),
    pagination: { page: currentPage, pageSize, totalItems, totalPages },
    statusCounts,
  }
}

const getCachedAdminComplaints = unstable_cache(readAdminComplaints, ["admin-complaints-v1"], { revalidate: 30, tags: ["complaints"] })

export async function getAdminComplaints(query: AdminComplaintQuery = {}) {
  const page = Math.max(Math.floor(query.page ?? 1), 1)
  const pageSize = Math.min(Math.max(Math.floor(query.pageSize ?? 12), 1), 50)
  return getCachedAdminComplaints({ page, pageSize, status: query.status?.trim() || undefined, category: query.category?.trim() || undefined, search: query.search?.trim() || undefined })
}
