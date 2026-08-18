import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsFilterFormProps {
  query: string
  category: string
}

export function NewsFilterForm({ query, category }: NewsFilterFormProps) {
  const hasActiveFilters = Boolean(query || category)

  return (
    <section aria-labelledby="news-filter-heading" className="news-filter rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4 sm:p-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="news-filter-heading" className="text-base font-bold text-slate-900">Jelajahi arsip</h2>
        <p className="text-sm text-slate-500">Cari berdasarkan kata kunci.</p>
      </div>
      <form role="search" className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" method="get">
        {category ? <input name="kategori" type="hidden" value={category} /> : null}
        <label className="relative block"><span className="sr-only">Kata kunci berita</span><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input name="q" type="search" defaultValue={query} placeholder="Cari judul, topik, atau isi berita" className="h-11 w-full rounded-xl border border-emerald-100 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" /></label>
        <div className="flex gap-2"><Button type="submit" className="flex-1 sm:flex-none">Terapkan</Button>{hasActiveFilters ? <Button asChild variant="outline" className="flex-1 sm:flex-none"><Link href="/berita">Reset</Link></Button> : null}</div>
      </form>
    </section>
  )
}
