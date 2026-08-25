import { prisma } from "@/app/lib/prisma"
import type { ServiceSubmissionStatusType, VillageService } from "@/generated/prisma/client"
import { SERVICE_STATUSES, STATUS_LABEL } from "@/lib/service-status"

export { SERVICE_STATUSES, STATUS_LABEL }

const defaults = [
  ["surat-keterangan-domisili", "Surat Keterangan Domisili", "Keterangan alamat dan domisili warga untuk kebutuhan administrasi.", "description", "1 hari kerja", ["KTP", "Kartu Keluarga"]],
  ["surat-keterangan-usaha", "Surat Keterangan Usaha", "Keterangan usaha warga untuk administrasi dan pengembangan UMKM.", "storefront", "1-2 hari kerja", ["KTP", "Kartu Keluarga", "Foto tempat usaha"]],
  ["surat-keterangan-tidak-mampu", "Surat Keterangan Tidak Mampu", "Pengantar keterangan kondisi ekonomi untuk keperluan bantuan atau pendidikan.", "heart", "1-2 hari kerja", ["KTP", "Kartu Keluarga"]],
  ["surat-pengantar-skck", "Surat Pengantar SKCK", "Surat pengantar desa untuk pengurusan SKCK di kepolisian.", "shield", "1 hari kerja", ["KTP", "Kartu Keluarga"]],
  ["surat-pengantar-nikah", "Surat Pengantar Nikah", "Pengantar administrasi pernikahan untuk Kantor Urusan Agama.", "heart-handshake", "1-2 hari kerja", ["KTP calon mempelai", "Kartu Keluarga", "Akta kelahiran"]],
  ["pengantar-kelahiran", "Pengantar Kelahiran", "Pengantar pencatatan kelahiran dan pengurusan akta kelahiran.", "baby", "1-2 hari kerja", ["KTP orang tua", "Kartu Keluarga", "Surat keterangan lahir"]],
  ["pengantar-kematian", "Pengantar Kematian", "Pengantar pencatatan kematian dan pengurusan dokumen terkait.", "file-heart", "1-2 hari kerja", ["KTP almarhum/almarhumah", "Kartu Keluarga", "Surat keterangan kematian"]],
  ["pengantar-pindah-datang", "Pengantar Pindah/Datang", "Pengantar administrasi kependudukan untuk warga pindah atau datang.", "map-pinned", "2 hari kerja", ["KTP", "Kartu Keluarga", "Surat pindah (bila ada)"]],
  ["perubahan-kk-ktp", "Perubahan KK/KTP", "Pengantar perubahan data kependudukan pada Kartu Keluarga atau KTP.", "badge", "2 hari kerja", ["KTP", "Kartu Keluarga", "Dokumen pendukung perubahan"]],
] as const

export async function ensureDefaultVillageServices() {
  const count = await prisma.villageService.count()
  if (count) return
  await prisma.$transaction(defaults.map(([slug, title, description, icon, estimatedTime, requirements], order) => prisma.villageService.create({
    data: { slug, title, description, icon, estimatedTime, order, requirements: { create: requirements.map((requirement, requirementOrder) => ({ title: requirement, order: requirementOrder })) } },
  })))
}

export async function getActiveVillageServices() {
  await ensureDefaultVillageServices()
  return prisma.villageService.findMany({ where: { isActive: true }, include: { requirements: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } })
}

export async function getVillageServiceBySlug(slug: string) {
  await ensureDefaultVillageServices()
  return prisma.villageService.findFirst({ where: { slug, isActive: true }, include: { requirements: { orderBy: { order: "asc" } } } })
}

export function normalizeWhatsapp(value: string) { return value.replace(/\D/g, "").replace(/^62/, "0") }
export function isServiceStatus(value: string): value is ServiceSubmissionStatusType { return SERVICE_STATUSES.includes(value as ServiceSubmissionStatusType) }
export type ServiceCatalogItem = VillageService & { requirements: { id: string; title: string; isRequired: boolean; order: number }[] }
