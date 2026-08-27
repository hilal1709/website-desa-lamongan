export const COMPLAINT_PAGE_SIZE = 4

export type ComplaintSummary = {
  id: string
  title: string
  category: string
  location: string
  status: string
  publicResponse: string | null
  respondedAt: string | null
  createdAt: string
}

export type ComplaintPage = {
  complaints: ComplaintSummary[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
