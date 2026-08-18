"use client"

import { FolderOpen, Search } from "lucide-react"
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
    <Card data-archive-toolbar className="rounded-[2rem] border-emerald-900/10 p-0 shadow-[0_22px_55px_rgba(7,49,37,0.12)]">
      <CardContent className="p-4 sm:p-6">
        <form role="search" className="grid gap-3 md:grid-cols-[1fr_220px]" onSubmit={(event) => event.preventDefault()}>
          <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
            <Search size={20} aria-hidden="true" className="text-slate-400" />
            <span className="sr-only">Cari dokumen</span>
            <Input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Cari judul, kategori, atau jenis dokumen..." className="h-auto border-0 bg-transparent p-0 shadow-none focus:bg-transparent focus:ring-0" />
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <FolderOpen size={19} aria-hidden="true" className="text-emerald-700" />
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
