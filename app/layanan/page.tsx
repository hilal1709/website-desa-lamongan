import { ArrowRight, BadgeCheck, FileText, HeartPulse, Store } from "lucide-react"

import { ServiceCard } from "@/components/home/service-card"
import { DataTable } from "@/components/ui/data-table"
import { PageHero } from "@/components/ui/page-hero"
import { getCmsPage } from "@/lib/cms-pages"
import type { Service } from "@/types"

const serviceIcons = [FileText, BadgeCheck, HeartPulse, Store]
const serviceTones: Service["tone"][] = ["blue", "emerald", "amber", "blue"]

export const dynamic = "force-dynamic"

export default async function Layanan() {
  const hero = await getCmsPage("layanan")
  const section = (key: string) => hero.sections.find((item) => item.key === key)
  const servicesSection = section("service-cards")
  const flowSection = section("flow")
  const statusSection = section("submission-status")

  const services: Service[] = (servicesSection?.items ?? []).map((item, index) => ({
    title: item.title,
    description: item.description ?? "",
    href: item.href ?? "/layanan-digital",
    icon: serviceIcons[index] ?? FileText,
    tone: serviceTones[index] ?? "emerald",
  }))

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} />

      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{flowSection?.title}</h2>
            <div className="mt-6 space-y-4">
              {(flowSection?.items ?? []).map((item, index) => (
                <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-600 font-bold text-white">{index + 1}</span>
                  <p className="font-semibold text-slate-700">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900">{statusSection?.title}</h2>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                Lihat semua <ArrowRight className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-6">
              <DataTable rows={(statusSection?.items ?? []).map((item) => ({ title: item.title, meta: item.meta ?? "", status: item.detail }))} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
