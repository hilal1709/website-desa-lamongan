export type ArchiveVisibility = "PUBLIC" | "PRIVATE"

export type ArchiveDocument = {
  id: number
  title: string
  detail: string | null
  type: string
  size: string
  visibility: ArchiveVisibility
  originalName: string | null
  storagePath: string | null
  uploadedAt: string
}

export type ArchiveFilter = "ALL" | ArchiveVisibility
