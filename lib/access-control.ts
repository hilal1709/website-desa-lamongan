import type { CmsModule } from "@/generated/prisma/client"

export const cmsModules = [
  ["DASHBOARD", "Dashboard", "/admin"], ["INFOGRAPHICS", "Infografis", "/admin/infografis"],
  ["ELDERLY_HEALTH", "Rekam Medis Lansia & Anak", "/admin/lansia"], ["UMKM", "UMKM", "/admin/umkm"],
  ["DISASTER_WEATHER", "Bencana & Cuaca", "/admin/bencana"], ["PAGE_CONTENT", "Tampilan Halaman", "/admin/konten"],
  ["NEWS", "Berita", "/admin/berita"], ["DOCUMENT_ARCHIVE", "Arsip Dokumen", "/admin/arsip"],
  ["SERVICE_CATALOG", "Katalog Layanan", "/admin/layanan"], ["SERVICE_SUBMISSIONS", "Pengajuan Layanan", "/admin/antrian"],
  ["COMPLAINTS", "Aduan", "/admin/aduan"], ["CMS_MODULES", "Modul CMS", "/admin/modul"], ["SETTINGS", "Pengaturan", "/admin/pengaturan"],
] as const satisfies readonly (readonly [CmsModule, string, string])[]

export type PermissionAction = "view" | "create" | "update" | "delete"
export type CurrentAdmin = {
  id: string; username: string; email: string; name: string | null; isActive: boolean; isSuperAdmin: boolean
  roles: { role: { id: string; name: string; permissions: { module: CmsModule; canView: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean }[] } }[]
}

const actionField = { view: "canView", create: "canCreate", update: "canUpdate", delete: "canDelete" } as const

export function canAccess(user: CurrentAdmin | null | undefined, module: CmsModule, action: PermissionAction = "view") {
  if (!user || !user.isActive) return false
  if (user.isSuperAdmin) return true
  const field = actionField[action]
  return user.roles.some(({ role }) => role.permissions.some((permission) => permission.module === module && permission[field]))
}

export function firstPermittedCmsPath(user: CurrentAdmin) {
  return cmsModules.find(([module]) => canAccess(user, module))?.[2] ?? null
}
