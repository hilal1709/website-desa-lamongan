import { createHash } from "crypto"
import { revalidateTag } from "next/cache"
import { prisma } from "@/app/lib/prisma"

export async function audit(action: string, resource: string, options: { actorId?: string; targetId?: string; ip?: string | null } = {}) {
  try {
    await prisma.auditLog.create({ data: { action, resource, actorId: options.actorId, targetId: options.targetId, ipHash: options.ip ? createHash("sha256").update(options.ip).digest("hex") : undefined } })
    revalidateTag("admin-audit-log", { expire: 0 })
  } catch {
    // An audit write must never expose data or interrupt the user operation.
  }
}
