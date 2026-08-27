import type { PublicDocument } from "./types"

export const ARCHIVE_PAGE_SIZE = 6
export const ALL_DOCUMENTS_CATEGORY = "Semua dokumen"

export function categoryFromMeta(meta: string) {
  return meta.split(" - ")[0] || "Dokumen lain"
}

export function documentMatchesQuery(document: PublicDocument, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase("id-ID")
  if (!normalizedQuery) return true
  return `${document.title} ${document.meta} ${document.detail ?? ""}`.toLocaleLowerCase("id-ID").includes(normalizedQuery)
}

export function createPageNumbers(currentPage: number, totalPages: number): Array<number | null> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const middle = [currentPage - 1, currentPage, currentPage + 1].filter((page) => page > 1 && page < totalPages)
  return [1, ...(middle[0] > 2 ? [null] : []), ...middle, ...(middle[middle.length - 1] < totalPages - 1 ? [null] : []), totalPages]
}
