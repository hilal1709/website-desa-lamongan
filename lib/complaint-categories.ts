export const COMPLAINT_CATEGORIES = [
  "Sarana dan Prasarana",
  "Sosbudpol",
  "Ekonomi",
  "Pertanian",
  "Teknologi Informasi",
] as const

export type ComplaintCategory = (typeof COMPLAINT_CATEGORIES)[number]

export function isComplaintCategory(value: string): value is ComplaintCategory {
  return COMPLAINT_CATEGORIES.includes(value as ComplaintCategory)
}
