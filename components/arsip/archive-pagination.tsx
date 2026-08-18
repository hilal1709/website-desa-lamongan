"use client"

import { Button } from "@/components/ui/button"

interface ArchivePaginationProps {
  currentPage: number
  pageNumbers: Array<number | null>
  perPage: number
  totalDocuments: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ArchivePagination({ currentPage, pageNumbers, perPage, totalDocuments, totalPages, onPageChange }: ArchivePaginationProps) {
  return <nav data-archive-pagination aria-label="Pagination dokumen" className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"><p className="text-sm text-slate-500">Menampilkan {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, totalDocuments)} dari {totalDocuments} dokumen</p><div className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"><Button type="button" variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Sebelumnya</Button>{pageNumbers.map((item, index) => item === null ? <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-400" aria-hidden="true">…</span> : <Button key={item} type="button" variant={item === currentPage ? "default" : "ghost"} size="sm" onClick={() => onPageChange(item)} aria-current={item === currentPage ? "page" : undefined} className="min-w-9 px-2">{item}</Button>)}<Button type="button" variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Berikutnya</Button></div></nav>
}
