import "server-only"

import { unstable_cache } from "next/cache"

import { prisma } from "@/app/lib/prisma"

async function readAdminArchiveDocuments() {
  return prisma.document.findMany({ orderBy: { uploadedAt: "desc" } })
}

// Authorization remains in the route/page boundary. The data is shared only
// after that check and every archive mutation invalidates this tag immediately.
export const getCachedAdminArchiveDocuments = unstable_cache(
  readAdminArchiveDocuments,
  ["admin-archive-documents-v1"],
  { revalidate: 60, tags: ["admin-archive-documents"] },
)
