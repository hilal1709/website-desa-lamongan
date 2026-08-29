import type { ComplaintStatus } from "@/lib/complaint-status"

export type AdminComplaint = {
  id: string
  title: string
  category: string
  location: string
  contact: string
  description: string
  status: ComplaintStatus
  publicResponse: string | null
  createdAt: string
  updatedAt: string
  respondedAt: string | null
}

export type ComplaintPagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type ComplaintResponse = {
  complaints?: AdminComplaint[]
  message?: string
  pagination?: ComplaintPagination
  statusCounts?: Record<ComplaintStatus, number>
}
