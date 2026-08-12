import { Briefcase, GraduationCap, Map, Users } from "lucide-react"

import { PageHero } from "@/components/ui/page-hero"
import { getCmsPage } from "@/lib/cms-pages"

const statIcons = [Users, Map, GraduationCap, Briefcase]
const ageColors = ["bg-green-800", "bg-emerald-700", "bg-slate-700"]

export const dynamic = "force-dynamic"

export default async function DataDesa() {
  const hero = await getCmsPage("data-desa")
  const section = (key: string) => hero.sections.find((item) => item.key === key)
  const statsSection = section("stats")
  const ageSection = section("age")
  const idmSection = section("idm")

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} />

      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(statsSection?.items ?? []).map((item, index) => {
            const Icon = statIcons[index] ?? Users
            return (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="text-green-800" />
                <p className="mt-5 text-4xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 font-bold text-slate-700">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500">{item.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">{ageSection?.title}</h2>
            <div className="mt-8 space-y-5">
              {(ageSection?.items ?? []).map((item, index) => (
                <div key={item.title}>
                  <div className="flex justify-between text-sm font-bold text-slate-900">
                    <span>{item.title}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${ageColors[index] ?? "bg-emerald-700"}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-lg">
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-300">{idmSection?.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold">{idmSection?.title}</h2>
            <p className="mt-8 text-6xl font-bold">{idmSection?.items?.[0]?.value}</p>
            <p className="mt-2 text-emerald-300">{idmSection?.description}</p>
          </div>
        </div>
      </div>
    </>
  )
}
