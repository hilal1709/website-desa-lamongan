import { NextResponse } from "next/server"

import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin, hasAdminRole } from "@/lib/admin-auth"
import { COMPLAINT_STATUSES, type ComplaintStatus } from "@/lib/complaint-status"

export async function GET(request: Request) {
  const user = await getCurrentAdmin()
  if (!hasAdminRole(user)) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")?.trim()
  const category = searchParams.get("category")?.trim()
  const search = searchParams.get("search")?.trim()
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10)
  const requestedPageSize = Number.parseInt(searchParams.get("pageSize") ?? "12", 10)
  const pageSize = Number.isFinite(requestedPageSize) ? Math.min(Math.max(requestedPageSize, 1), 50) : 12
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
  const page = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), totalPages) : 1
  const complaints = await prisma.complaint.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })

  const statusCounts = Object.fromEntries(COMPLAINT_STATUSES.map((item) => [item, groupedStatuses.find((group) => group.status === item)?._count._all ?? 0])) as Record<ComplaintStatus, number>
  return NextResponse.json({ complaints: complaints.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), respondedAt: item.respondedAt?.toISOString() ?? null })), pagination: { page, pageSize, totalItems, totalPages }, statusCounts })
}
