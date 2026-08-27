import { prisma } from "@/app/lib/prisma"
import { COMPLAINT_PAGE_SIZE, type ComplaintPage } from "@/lib/complaint-types"
import { unstable_cache } from "next/cache"

export type { ComplaintPage, ComplaintSummary } from "@/lib/complaint-types"

const complaintSelect = { id: true, title: true, category: true, location: true, status: true, publicResponse: true, respondedAt: true, createdAt: true } as const

async function readComplaintsPage(page: number, pageSize: number): Promise<ComplaintPage> {
  const totalItems = await prisma.complaint.count()
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(page, totalPages)
  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    select: complaintSelect,
  })

  return {
    complaints: complaints.map((complaint) => ({ ...complaint, createdAt: complaint.createdAt.toISOString(), respondedAt: complaint.respondedAt?.toISOString() ?? null })),
    page: currentPage,
    pageSize,
    totalItems,
    totalPages,
  }
}

const getCachedComplaintsPage = unstable_cache(readComplaintsPage, ["complaints-page-v1"], { revalidate: 60, tags: ["complaints"] })

export async function getComplaintsPage(requestedPage = 1, requestedPageSize = COMPLAINT_PAGE_SIZE) {
  const page = Math.max(Math.floor(requestedPage) || 1, 1)
  const pageSize = Math.min(Math.max(Math.floor(requestedPageSize) || COMPLAINT_PAGE_SIZE, 1), 20)
  return getCachedComplaintsPage(page, pageSize)
}
