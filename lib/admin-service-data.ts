import "server-only"

import { unstable_cache } from "next/cache"

import { prisma } from "@/app/lib/prisma"

async function readAdminServiceCatalog() {
  return prisma.villageService.findMany({
    include: { requirements: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  })
}

// The catalog has no resident data, so it is safe to share across authorized
// CMS users. Mutations invalidate this tag immediately.
export const getCachedAdminServiceCatalog = unstable_cache(
  readAdminServiceCatalog,
  ["admin-service-catalog-v1"],
  { revalidate: 60, tags: ["admin-service-catalog"] },
)
