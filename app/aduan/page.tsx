import { Send } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { PageHero } from "@/components/ui/page-hero"
import { getCmsPage } from "@/lib/cms-pages"

export const dynamic = "force-dynamic"

export default async function Aduan() {
  const hero = await getCmsPage("aduan")
  const formSection = hero.sections.find((item) => item.key === "complaint-form")
  const historySection = hero.sections.find((item) => item.key === "complaint-history")
  const fields = formSection?.items ?? []

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} />

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">{formSection?.title}</h2>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {fields.slice(0, 4).map((field) => (
              <label key={field.title} className="block text-sm font-bold text-slate-900">
                {field.title}
                <input type="text" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition hover:border-slate-300 focus:border-green-800 focus:bg-white" />
              </label>
            ))}
          </div>

          <label className="mt-5 block text-sm font-bold text-slate-900">
            {fields[4]?.title}
            <textarea rows={5} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition hover:border-slate-300 focus:border-green-800 focus:bg-white" />
          </label>

          <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800">
            <Send size={17} /> Kirim laporan
          </button>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900">{historySection?.title}</h2>
          <DataTable rows={(historySection?.items ?? []).map((item) => ({ title: item.title, meta: item.meta ?? "", status: item.detail }))} />
        </div>
      </div>
    </>
  )
}
