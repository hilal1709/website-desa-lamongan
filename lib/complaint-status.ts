export const COMPLAINT_STATUSES = ["Baru", "Diproses", "Selesai", "Ditutup"] as const

export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number]

export function isComplaintStatus(value: string): value is ComplaintStatus {
  return COMPLAINT_STATUSES.includes(value as ComplaintStatus)
}
