import "server-only"

import { unstable_cache } from "next/cache"
import { prisma } from "@/app/lib/prisma"

async function readAdminDisasterData() {
  const [setting, locations] = await Promise.all([
    prisma.disasterSetting.findUnique({
      where: { id: 1 },
      select: { override: true, announcement: true },
    }),
    prisma.disasterLocation.findMany({
      select: { id: true, name: true, description: true, type: true, latitude: true, longitude: true, isActive: true },
      orderBy: { updatedAt: "desc" },
    }),
  ])

  return { setting, locations }
}

// Authorization remains in the admin layout. The underlying disaster data is
// identical for every permitted CMS user and is refreshed by the PUT handler.
export const getCachedAdminDisasterData = unstable_cache(
  readAdminDisasterData,
  ["admin-disaster-data-v1"],
  { revalidate: 60, tags: ["disaster-data"] },
)
