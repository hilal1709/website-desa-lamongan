import { getCurrentAdmin } from "@/lib/admin-auth"
import { canAccess, type PermissionAction } from "@/lib/access-control"
import type { CmsModule } from "@/generated/prisma/client"
import { audit } from "@/lib/audit-log"

export async function requireCmsPermission(module: CmsModule, action: PermissionAction = "view") {
  const user = await getCurrentAdmin()
  if (!user) return { user: null, response: Response.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 }) }
  if (!canAccess(user, module, action)) return { user: null, response: Response.json({ error: "Anda tidak memiliki hak akses untuk tindakan ini." }, { status: 403 }) }
  if (action !== "view") await audit("CMS_MUTATION_AUTHORIZED", module, { actorId: user.id })
  return { user, response: null }
}
