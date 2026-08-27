"use client"

import { ComplaintArrowLeftIcon, ComplaintArrowRightIcon } from "@/components/aduan/complaint-icons"
import { Button } from "@/components/ui/button"

type ComplaintPaginationProps = {
  page: number
  totalItems: number
  totalPages: number
  pageSize: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

function pageNumbers(page: number, totalPages: number) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const middle = [page - 1, page, page + 1].filter((item) => item > 1 && item < totalPages)
  return [1, ...(middle[0] > 2 ? [null] : []), ...middle, ...(middle.at(-1)! < totalPages - 1 ? [null] : []), totalPages]
}

export function ComplaintPagination({ page, totalItems, totalPages, pageSize, isLoading, onPageChange }: ComplaintPaginationProps) {
  if (totalItems <= pageSize) return null
  const first = (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, totalItems)

  return <nav aria-label="Paginasi aduan" className="complaint-pagination flex min-w-0 flex-col gap-3 border-t border-slate-100 px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-4">
    <p className="text-xs text-slate-500 sm:text-sm" aria-live="polite">Menampilkan {first}–{last} dari {totalItems} aduan</p>
    <div className="-mx-1 flex max-w-full items-center gap-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:pb-0">
      <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={isLoading || page === 1}><ComplaintArrowLeftIcon aria-hidden />Sebelumnya</Button>
      {pageNumbers(page, totalPages).map((item, index) => item === null ? <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-400" aria-hidden="true">…</span> : <Button key={item} type="button" variant={item === page ? "default" : "ghost"} size="sm" className="min-w-9 px-2" onClick={() => onPageChange(item)} disabled={isLoading} aria-current={item === page ? "page" : undefined}>{item}</Button>)}
      <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={isLoading || page === totalPages}>Berikutnya<ComplaintArrowRightIcon aria-hidden /></Button>
    </div>
  </nav>
}
