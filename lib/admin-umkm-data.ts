import "server-only"

import { unstable_cache } from "next/cache"

import { prisma } from "@/app/lib/prisma"

async function readAdminUmkm() {
  return prisma.umkm.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      description: true,
      logoUrl: true,
      whatsapp: true,
      address: true,
      dusun: true,
      registeredAt: true,
      isPublished: true,
      products: {
        select: { id: true, name: true, description: true, imageUrl: true, price: true, variants: true, isAvailable: true },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  })
}

// Authorization remains outside the cache. The shared catalog query is safe to
// reuse for authorized CMS users and is invalidated immediately by every UMKM CRUD route.
export const getCachedAdminUmkm = unstable_cache(readAdminUmkm, ["admin-umkm-v1"], { revalidate: 60, tags: ["umkm"] })
