import type { CmsModule } from "@/generated/prisma/client"

export const cmsModules = [
  ["DASHBOARD", "Dashboard", "/admin"], ["INFOGRAPHICS", "Infografis", "/admin/infografis"],
  ["ELDERLY_HEALTH", "Rekam Medis Lansia & Anak", "/admin/lansia"], ["UMKM", "UMKM", "/admin/umkm"],
  ["DISASTER_WEATHER", "Bencana & Cuaca", "/admin/bencana"], ["PAGE_CONTENT", "Tampilan Halaman", "/admin/konten"],
  ["NEWS", "Berita", "/admin/berita"], ["DOCUMENT_ARCHIVE", "Arsip Dokumen", "/admin/arsip"],
  ["SERVICE_CATALOG", "Katalog Layanan", "/admin/layanan"], ["SERVICE_SUBMISSIONS", "Pengajuan Layanan", "/admin/layanan"],
  ["COMPLAINTS", "Aduan", "/admin/aduan"], ["CMS_MODULES", "Modul CMS", "/admin/modul"], ["SETTINGS", "Pengaturan", "/admin/pengaturan"],
] as const satisfies readonly (readonly [CmsModule, string, string])[]

type PermissionField = "canView" | "canCreate" | "canUpdate" | "canDelete"

const moduleAccessConfig = {
  DASHBOARD: { group: "Navigasi & ringkasan", description: "Beranda ringkasan operasional CMS.", actions: ["canView"] },
  CMS_MODULES: { group: "Navigasi & ringkasan", description: "Halaman pintasan seluruh modul CMS.", actions: ["canView"] },
  INFOGRAPHICS: { group: "Data kependudukan", description: "Data penduduk, peristiwa, dan infografis desa.", actions: ["canView", "canCreate", "canUpdate", "canDelete"] },
  ELDERLY_HEALTH: { group: "Data kependudukan", description: "Rekam medis lansia, anak, dan balita.", actions: ["canView", "canCreate", "canUpdate", "canDelete"] },
  UMKM: { group: "Ekonomi & kesiapsiagaan", description: "Profil usaha dan katalog produk UMKM.", actions: ["canView", "canCreate", "canUpdate", "canDelete"] },
  DISASTER_WEATHER: { group: "Ekonomi & kesiapsiagaan", description: "Status bencana, cuaca, dan titik peta.", actions: ["canView", "canUpdate"] },
  PAGE_CONTENT: { group: "Publikasi desa", description: "Konten statis pada halaman publik.", actions: ["canView", "canUpdate"] },
  NEWS: { group: "Publikasi desa", description: "Artikel dan kategori berita desa.", actions: ["canView", "canUpdate"] },
  DOCUMENT_ARCHIVE: { group: "Publikasi desa", description: "Arsip dokumen publik maupun privat.", actions: ["canView", "canCreate", "canUpdate", "canDelete"] },
  SERVICE_CATALOG: { group: "Layanan warga", description: "Katalog layanan administrasi desa.", actions: ["canView", "canCreate", "canUpdate", "canDelete"] },
  SERVICE_SUBMISSIONS: { group: "Layanan warga", description: "Pengajuan layanan yang masuk dari warga.", actions: ["canView", "canUpdate"] },
  COMPLAINTS: { group: "Layanan warga", description: "Aduan warga dan tindak lanjutnya.", actions: ["canView", "canCreate", "canUpdate", "canDelete"] },
  SETTINGS: { group: "Sistem", description: "Identitas desa, SEO, dan konfigurasi sistem.", actions: ["canView", "canUpdate"] },
} as const satisfies Record<CmsModule, { group: string; description: string; actions: readonly PermissionField[] }>

export const cmsAccessMatrix = cmsModules.map(([id, label]) => ({ id, label, ...moduleAccessConfig[id] }))

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
