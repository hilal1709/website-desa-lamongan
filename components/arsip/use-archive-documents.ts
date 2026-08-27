"use client"

import { useMemo, useState } from "react"
import { ALL_DOCUMENTS_CATEGORY, ARCHIVE_PAGE_SIZE, categoryFromMeta, createPageNumbers, documentMatchesQuery } from "./document-utils"
import type { PublicDocument } from "./types"

export function useArchiveDocuments(documents: PublicDocument[]) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState(ALL_DOCUMENTS_CATEGORY)
  const [page, setPage] = useState(1)

  const categories = useMemo(
    () => [ALL_DOCUMENTS_CATEGORY, ...Array.from(new Set(documents.map((document) => categoryFromMeta(document.meta))))],
    [documents],
  )
  const filteredDocuments = useMemo(
    () => documents.filter((document) => documentMatchesQuery(document, query) && (category === ALL_DOCUMENTS_CATEGORY || categoryFromMeta(document.meta) === category)),
    [category, documents, query],
  )
  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / ARCHIVE_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visibleDocuments = filteredDocuments.slice((currentPage - 1) * ARCHIVE_PAGE_SIZE, currentPage * ARCHIVE_PAGE_SIZE)

  return {
    categories,
    category,
    currentPage,
    filteredCount: filteredDocuments.length,
    pageNumbers: createPageNumbers(currentPage, totalPages),
    perPage: ARCHIVE_PAGE_SIZE,
    query,
    totalPages,
    visibleDocuments,
    setPage,
    setQuery: (value: string) => { setQuery(value); setPage(1) },
    setCategory: (value: string) => { setCategory(value); setPage(1) },
  }
}
