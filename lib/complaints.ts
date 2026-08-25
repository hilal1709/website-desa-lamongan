import { prisma } from "@/app/lib/prisma"
import { unstable_cache } from "next/cache"

export type ComplaintSummary = {
  id: string
  title: string
  category: string
  location: string
  status: string
  publicResponse: string | null
  respondedAt: string | null
  createdAt: string
}

const getCachedRecentComplaints = unstable_cache(async (): Promise<ComplaintSummary[]> => {
  const complaints = await prisma.complaint.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, title: true, category: true, location: true, status: true, publicResponse: true, respondedAt: true, createdAt: true },
  })

  return complaints.map((complaint) => ({ ...complaint, createdAt: complaint.createdAt.toISOString(), respondedAt: complaint.respondedAt?.toISOString() ?? null }))
}, ["recent-complaints"], { revalidate: 60, tags: ["complaints"] })

export async function getRecentComplaints() {
  return getCachedRecentComplaints()
}
