import type { ServiceSubmissionStatusType } from "@/generated/prisma/client"

export const SERVICE_STATUSES = ["DIAJUKAN", "DIVERIFIKASI", "PERLU_DILENGKAPI", "DITOLAK", "SIAP_DIAMBIL", "SELESAI"] as const
export const STATUS_LABEL: Record<ServiceSubmissionStatusType, string> = {
  DIAJUKAN: "Diajukan",
  DIVERIFIKASI: "Diverifikasi",
  PERLU_DILENGKAPI: "Perlu dilengkapi",
  DITOLAK: "Ditolak",
  SIAP_DIAMBIL: "Siap diambil",
  SELESAI: "Selesai",
}
