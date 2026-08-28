"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon"
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon"
import { Button } from "@/components/ui/button"

export type ChildPagination = { page: number; pageSize: number; totalItems: number; totalPages: number }

export function ChildPaginationControls({ pagination, busy, onPageChange }: { pagination: ChildPagination; busy?: boolean; onPageChange: (page: number) => void }) {
  if (pagination.totalItems <= pagination.pageSize) return null
  const first = (pagination.page - 1) * pagination.pageSize + 1
  const last = Math.min(pagination.page * pagination.pageSize, pagination.totalItems)
  return <nav className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between" aria-label="Paginasi data anak" aria-live="polite"><p className="text-center text-sm text-slate-600 sm:text-left">Menampilkan <b>{first}–{last}</b> dari <b>{pagination.totalItems}</b> anak</p><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex"><Button type="button" variant="outline" size="sm" className="w-full px-2 sm:w-auto sm:px-3" disabled={busy || pagination.page === 1} onClick={() => onPageChange(pagination.page - 1)}><HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={1.8} aria-hidden="true" /><span className="hidden min-[400px]:inline">Sebelumnya</span></Button><span className="min-w-14 text-center text-sm font-bold text-emerald-800" aria-current="page">{pagination.page} / {pagination.totalPages}</span><Button type="button" variant="outline" size="sm" className="w-full px-2 sm:w-auto sm:px-3" disabled={busy || pagination.page === pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)}><span className="hidden min-[400px]:inline">Berikutnya</span><HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} aria-hidden="true" /></Button></div></nav>
}
