import { FileArchive, Search } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { PageHero } from "@/components/ui/page-hero"
import { getCmsPage } from "@/lib/cms-pages"

export const dynamic = "force-dynamic"

export default async function Arsip() {
  const hero = await getCmsPage("arsip")
  const documents = hero.sections.find((item) => item.key === "documents")
  const notice = hero.sections.find((item) => item.key === "notice")

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} />

      <div className="mx-auto max-w-5xl px-5 py-16">
        <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-400 shadow-sm">
          <Search size={20} />
          <span className="text-sm">Cari dokumen atau keputusan desa...</span>
        </div>

        <DataTable rows={(documents?.items ?? []).map((item) => ({ title: item.title, meta: item.meta ?? "", status: item.detail }))} />

        <div className="mt-8 flex items-center gap-4 rounded-3xl border border-blue-200 bg-blue-50 p-6">
          <FileArchive className="text-green-800" />
          <p className="text-sm text-blue-900">{notice?.title}</p>
        </div>
      </div>
    </>
  )
}
