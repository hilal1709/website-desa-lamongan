import "server-only"

import { unstable_cache } from "next/cache"

import { prisma } from "@/app/lib/prisma"

async function readAdminAccessData() {
  const [users, roles] = await Promise.all([
    prisma.adminUser.findMany({ select: { id: true, username: true, email: true, name: true, isActive: true, isSuperAdmin: true, roles: { select: { roleId: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.role.findMany({ include: { permissions: true, _count: { select: { users: true } } }, orderBy: [{ isSystem: "desc" }, { name: "asc" }] }),
  ])
  return { users, roles }
}

// Authorization stays at the page/API boundary. This shared query is used only
// after that check and every account or role mutation immediately invalidates it.
export const getCachedAdminAccessData = unstable_cache(
  readAdminAccessData,
  ["admin-access-v1"],
  { revalidate: 60, tags: ["admin-access"] },
)
