import Link from "next/link"
import { ArrowUpRight, BadgeCheck, FileText, HeartPulse, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { CmsSectionItem } from "@/lib/cms-pages"

const icons = { description: FileText, badge: BadgeCheck, favorite: HeartPulse, storefront: Store }
const tones = { description: "bg-emerald-50 text-emerald-700", badge: "bg-teal-50 text-teal-700", favorite: "bg-amber-50 text-amber-700", storefront: "bg-sky-50 text-sky-700" }

export function ServiceCard({ service }: { service: CmsSectionItem }) {
  const Icon = icons[service.icon as keyof typeof icons] ?? FileText
  const tone = tones[service.icon as keyof typeof tones] ?? tones.description
  return <article><Card className="layanan-service-card group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-colors duration-300 sm:rounded-3xl hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/10"><CardHeader className="p-5 sm:p-6"><span className={`layanan-service-icon grid size-11 place-items-center rounded-2xl sm:size-12 ${tone}`}><Icon size={22} aria-hidden="true" /></span><CardTitle className="mt-4 text-lg leading-snug group-hover:text-emerald-700 sm:text-xl">{service.title}</CardTitle>{service.description ? <p className="mt-2 text-sm leading-6 text-slate-500">{service.description}</p> : null}</CardHeader><CardFooter className="mt-auto p-5 pt-0 sm:p-6 sm:pt-0"><Button asChild variant="ghost" className="-ml-3 min-h-11 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"><Link href={service.href ?? "/layanan-digital"} aria-label={`Akses layanan ${service.title}`}>Akses layanan <ArrowUpRight className="layanan-service-arrow" aria-hidden="true" /></Link></Button></CardFooter></Card></article>
}
