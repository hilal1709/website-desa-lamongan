"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

const ChevronLeft = () => <HugeiconsIcon icon={ArrowLeft01Icon} />
const ChevronRight = () => <HugeiconsIcon icon={ArrowRight01Icon} />

type PaginationControlsProps = {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  itemLabel?: string
  className?: string
}

function pageNumbers(page: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const middle = [page - 1, page, page + 1].filter((item) => item > 1 && item < totalPages)
  return [1, ...(middle[0] > 2 ? [null] : []), ...middle, ...(middle[middle.length - 1] < totalPages - 1 ? [null] : []), totalPages]
}

export function PaginationControls({ page, totalPages, totalItems, pageSize, onPageChange, itemLabel = "data", className = "" }: PaginationControlsProps) {
  if (totalItems <= pageSize) return null
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const first = (currentPage - 1) * pageSize + 1
  const last = Math.min(currentPage * pageSize, totalItems)

  return <nav aria-label={`Paginasi ${itemLabel}`} className={`flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
    <p className="text-sm text-slate-500">Menampilkan {first}–{last} dari {totalItems} {itemLabel}</p>
    <div className="flex max-w-full items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
      <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Halaman sebelumnya"><ChevronLeft />Sebelumnya</Button>
      {pageNumbers(currentPage, totalPages).map((item, index) => item === null ? <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-400" aria-hidden="true">…</span> : <Button key={item} type="button" variant={item === currentPage ? "default" : "ghost"} size="sm" className="min-w-9 px-2" onClick={() => onPageChange(item)} aria-current={item === currentPage ? "page" : undefined}>{item}</Button>)}
      <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Halaman berikutnya">Berikutnya<ChevronRight /></Button>
    </div>
  </nav>
}
