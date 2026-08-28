"use client"

import { Button } from "@/components/ui/button"
import type { Pagination } from "@/components/lansia/elderly-health-types"

type Props = { pagination: Pagination; onPageChange: (page: number) => void }

export function ElderlyPagination({ pagination, onPageChange }: Props) {
  if (pagination.totalItems <= pagination.pageSize) return null
  const first = (pagination.page - 1) * pagination.pageSize + 1
  const last = Math.min(pagination.page * pagination.pageSize, pagination.totalItems)
  return <nav className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm" aria-label="Paginasi data lansia" aria-live="polite"><p className="text-sm text-slate-600">Menampilkan <b>{first}–{last}</b> dari <b>{pagination.totalItems}</b> lansia</p><div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1}>Sebelumnya</Button><span className="min-w-20 text-center text-sm font-bold text-emerald-800" aria-current="page">{pagination.page} / {pagination.totalPages}</span><Button type="button" variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>Berikutnya</Button></div></nav>
}
