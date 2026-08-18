import { unstable_cache } from "next/cache"
import { prisma } from "@/app/lib/prisma"

export const getArchiveDocuments = unstable_cache(
  async () => {
    try {
      return await prisma.document.findMany({
        select: { id: true, title: true, type: true, size: true },
        orderBy: { uploadedAt: "desc" },
      })
    } catch {
      return []
    }
  },
  ["archive-documents"],
  { revalidate: 300, tags: ["archive-documents"] },
)
