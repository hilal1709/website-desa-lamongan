"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon"
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ArchiveFiltersProps {
  categories: string[]
  category: string
  query: string
  onCategoryChange: (value: string) => void
  onQueryChange: (value: string) => void
}

export function ArchiveFilters({ categories, category, query, onCategoryChange, onQueryChange }: ArchiveFiltersProps) {
  return (
    <Card data-archive-toolbar className="rounded-[1.5rem] border-slate-200 p-0 shadow-sm sm:rounded-[2rem]">
      <CardContent className="p-3 sm:p-6">
        <form role="search" className="grid gap-3 md:grid-cols-[1fr_220px]" onSubmit={(event) => event.preventDefault()}>
          <label className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 sm:rounded-2xl sm:px-4">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={1.8} aria-hidden="true" className="size-5 text-slate-400" />
            <span className="sr-only">Cari dokumen</span>
            <Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Cari judul, kategori, atau jenis dokumen..." className="h-auto border-0 bg-transparent p-0 shadow-none focus:bg-transparent focus:ring-0" />
          </label>
          <label className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:rounded-2xl sm:px-4">
            <HugeiconsIcon icon={Folder01Icon} strokeWidth={1.8} aria-hidden="true" className="size-[19px] text-emerald-700" />
            <span className="sr-only">Filter kategori</span>
            <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </form>
      </CardContent>
    </Card>
  )
}
