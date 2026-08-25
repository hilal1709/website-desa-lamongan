import { getCurrentAdmin } from "@/lib/admin-auth"
import { canAccess, type PermissionAction } from "@/lib/access-control"
import type { CmsModule } from "@/generated/prisma/client"

export async function requireCmsPermission(module: CmsModule, action: PermissionAction = "view") {
  const user = await getCurrentAdmin()
  if (!user) return { user: null, response: Response.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 }) }
  if (!canAccess(user, module, action)) return { user: null, response: Response.json({ error: "Anda tidak memiliki hak akses untuk tindakan ini." }, { status: 403 }) }
  return { user, response: null }
}
