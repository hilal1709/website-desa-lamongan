import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, CheckCircle2, Trees, Users, type LucideIcon } from "lucide-react"

import type { CmsSection } from "@/lib/cms-pages"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const statIcons: LucideIcon[] = [Users, Trees]

export function ProfileHistorySection({ section }: { section?: CmsSection }) {
  if (!section) return null
  return <section aria-labelledby="profile-history-title" className="grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch"><article className="profile-history-copy"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 sm:text-sm sm:tracking-[0.18em]">{section.eyebrow}</p><h2 id="profile-history-title" className="mt-3 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{section.title}</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">{section.description}</p><dl className="mt-7 grid gap-3 min-[420px]:grid-cols-2 sm:mt-8 sm:gap-4">{(section.items ?? []).map((item, index) => { const Icon = statIcons[index % statIcons.length]; return <Card key={`${item.title}-${index}`} className="profile-stat-card rounded-3xl border-slate-200 bg-slate-50 transition-shadow hover:shadow-md"><CardContent className="p-4 sm:p-5"><Icon className="text-emerald-600" aria-hidden="true" /><dt className="mt-4 font-black text-slate-900">{item.value ?? item.title}</dt><dd className="mt-1 text-sm text-slate-500">{item.description ?? item.detail}</dd></CardContent></Card> })}</dl></article><Card className="profile-history-visual relative aspect-[4/3] min-h-[250px] overflow-hidden rounded-3xl border-slate-200 bg-emerald-950 shadow-lg sm:min-h-[320px] sm:rounded-[32px] lg:aspect-auto">{section.image ? <Image src={section.image} alt={section.title ?? ""} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /> : null}</Card></section>
}

export function VisionMissionSection({ section }: { section?: CmsSection }) {
  if (!section) return null
  return <section aria-labelledby="vision-mission-title"><Card className="profile-vision-card my-12 grid overflow-hidden rounded-3xl border-emerald-100 shadow-sm sm:my-16 sm:rounded-[32px] lg:grid-cols-[0.9fr_1.1fr]"><CardHeader className="bg-emerald-800 p-6 text-white sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200 sm:text-sm sm:tracking-[0.18em]">{section.eyebrow}</p><CardTitle id="vision-mission-title" className="mt-3 text-2xl font-black leading-tight sm:text-3xl">{section.title}</CardTitle><div className="mt-6 border-l-2 border-emerald-300 pl-4 sm:mt-8 sm:pl-5"><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-200">Visi</p><p className="mt-3 text-base font-semibold leading-7 text-white sm:text-lg sm:leading-8">{section.description}</p></div></CardHeader><CardContent className="p-6 sm:p-10"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Misi</p><ul className="mt-6 space-y-4 sm:mt-7">{(section.items ?? []).map((mission, index) => <li key={`${mission.title}-${index}`} className="profile-mission-item flex gap-3 text-slate-600"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" /><span className="leading-7">{mission.title}</span></li>)}</ul></CardContent></Card></section>
}

export function GovernmentCtaSection({ section }: { section?: CmsSection }) {
  if (!section) return null
  return <aside aria-labelledby="government-cta-title"><Card className="profile-structure-cta my-12 rounded-3xl border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white shadow-sm sm:my-16 sm:rounded-[32px]"><CardContent className="p-6 sm:p-10"><div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><div className="space-y-2"><p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800"><Building2 className="h-3.5 w-3.5" aria-hidden="true" />{section.eyebrow}</p><h2 id="government-cta-title" className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{section.title}</h2></div><Button asChild size="lg" className="h-auto w-full shrink-0 rounded-2xl px-6 py-4 shadow-lg shadow-emerald-700/20 hover:shadow-xl md:w-auto"><Link href={section.href ?? "#"}><span>{section.action}</span><ArrowRight className="h-5 w-5" aria-hidden="true" /></Link></Button></div></CardContent></Card></aside>
}
