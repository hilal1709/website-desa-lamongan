import { CalendarDays, HeartPulse, TrendingDown, Users } from "lucide-react"

import { PageHero } from "@/components/ui/page-hero"
import { getCmsPage } from "@/lib/cms-pages"

const icons = [Users, HeartPulse, CalendarDays, TrendingDown]
const colors = ["text-green-800", "text-rose-700", "text-emerald-700", "text-amber-700"]

export const dynamic = "force-dynamic"

export default async function Stunting() {
  const hero = await getCmsPage("stunting")
  const healthStats = hero.sections.find((item) => item.key === "health-stats")
  const visits = hero.sections.find((item) => item.key === "visits")
  const program = hero.sections.find((item) => item.key === "program")

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} />

      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(healthStats?.items ?? []).map((item, index) => {
            const Icon = icons[index] ?? Users
            return (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className={colors[index] ?? "text-green-800"} />
                <p className="mt-5 text-4xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm font-bold text-slate-600">{item.title}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">{visits?.title}</h2>
            <div className="mt-8 flex h-48 items-end justify-between gap-3">
              {(visits?.items ?? []).map((item) => (
                <div key={item.title} className="flex flex-1 flex-col items-center gap-3">
                  <div className="w-full rounded-t-xl bg-green-800" style={{ height: `${item.value}%` }} />
                  <span className="text-xs text-slate-400">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">{program?.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold text-emerald-950">{program?.title}</h2>
            <p className="mt-4 leading-7 text-emerald-900/70">{program?.description}</p>
          </div>
        </div>
      </div>
    </>
  )
}
