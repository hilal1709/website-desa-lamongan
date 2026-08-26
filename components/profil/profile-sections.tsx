import Image from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import type { CmsSection, CmsSectionItem } from "@/lib/cms-pages"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ProfileArrowRightIcon, ProfileBuildingIcon, ProfileCheckIcon, ProfileCompassIcon, ProfileLeafIcon, ProfileTreesIcon, ProfileUsersIcon } from "@/components/profil/profile-icons"
import { ProfileSectionHeading } from "@/components/profil/profile-section-heading"

const statIcons: LucideIcon[] = [ProfileUsersIcon, ProfileTreesIcon, ProfileLeafIcon]
const storyFallback = "Berakar pada gotong royong, bergerak untuk masa depan."

function ProfileStatCard({ item, index }: { item: CmsSectionItem; index: number }) {
  const Icon = statIcons[index % statIcons.length]
  const value = item.value ?? item.title
  return <Card className="profile-stat-card group min-w-0 rounded-3xl border-emerald-100 bg-emerald-50/55 transition-colors hover:bg-white"><CardContent className="p-4 sm:p-5"><span className="grid size-10 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm transition-transform group-hover:rotate-6"><Icon className="size-5" /></span><dt data-profile-count={value} className="mt-5 break-words text-2xl font-black tracking-tight text-slate-950">{value}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-500">{item.description ?? item.detail}</dd></CardContent></Card>
}

function HistoryImage({ section }: { section: CmsSection }) {
  const eyebrow = section.captionEyebrow ?? "Kedungrejo · Modo · Lamongan"
  const title = section.captionTitle ?? "Kearifan lokal yang tumbuh bersama peluang baru."
  return <Card className="profile-history-visual group relative aspect-[4/3] min-h-[260px] overflow-hidden rounded-3xl border-emerald-950 bg-emerald-950 shadow-xl shadow-emerald-950/20 min-[390px]:min-h-[280px] min-[390px]:rounded-[2rem] sm:min-h-[380px] lg:aspect-auto"><figure className="contents">{section.image ? <Image src={section.image} alt={section.title ?? "Sejarah Desa Kedungrejo"} fill sizes="(min-width: 1024px) 45vw, 100vw" className="profile-history-image object-cover transition-transform duration-700 group-hover:scale-105" /> : null}<div className="absolute inset-x-0 bottom-0 h-44 bg-emerald-950/75" /><figcaption className="profile-image-caption absolute inset-x-0 bottom-0 p-5 text-white min-[390px]:p-6 sm:p-8"><p className="break-words text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200 min-[390px]:text-xs min-[390px]:tracking-[0.18em]">{eyebrow}</p><p className="mt-2 max-w-sm break-words text-base font-bold leading-6 min-[390px]:text-lg">{title}</p></figcaption></figure><span className="profile-orbit absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm min-[390px]:right-7 min-[390px]:top-7 min-[390px]:size-14"><ProfileLeafIcon className="size-5 min-[390px]:size-6" /></span></Card>
}

export function ProfileHistorySection({ section }: { section?: CmsSection }) {
  if (!section) return null
  return <section aria-labelledby="profile-history-title" className="grid min-w-0 gap-5 min-[390px]:gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch"><article className="profile-history-copy min-w-0 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm min-[390px]:rounded-[2rem] min-[390px]:p-6 sm:p-9"><ProfileSectionHeading eyebrow={section.eyebrow} title={section.title ?? "Sejarah Desa"} icon={ProfileCompassIcon} titleId="profile-history-title" /><p className="mt-5 break-words text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{section.description}</p><dl className="mt-7 grid gap-3 min-[420px]:grid-cols-2 sm:mt-8 sm:gap-4">{(section.items ?? []).map((item, index) => <ProfileStatCard key={`${item.title}-${index}`} item={item} index={index} />)}</dl><p className="profile-story-line mt-7 flex items-start gap-3 text-sm font-bold leading-6 text-emerald-800 sm:mt-8"><span aria-hidden="true" className="mt-3 h-px w-8 shrink-0 bg-emerald-400 min-[390px]:w-10" /><span className="break-words">{section.storyLine ?? storyFallback}</span></p></article><HistoryImage section={section} /></section>
}

export function VisionMissionSection({ section }: { section?: CmsSection }) {
  if (!section) return null
  return <section aria-labelledby="vision-mission-title"><Card className="profile-vision-card my-10 grid min-w-0 overflow-hidden rounded-3xl border-emerald-100 bg-white shadow-sm min-[390px]:my-12 min-[390px]:rounded-[2rem] sm:my-16 lg:grid-cols-[0.9fr_1.1fr]"><CardHeader className="min-w-0 bg-emerald-900 p-5 text-white min-[390px]:p-7 sm:p-10"><ProfileSectionHeading eyebrow={section.eyebrow} title={section.title ?? "Visi & Misi"} icon={ProfileCompassIcon} titleId="vision-mission-title" dark /><div className="mt-7 border-l-2 border-emerald-300 pl-4 min-[390px]:mt-8 min-[390px]:pl-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Visi</p><p className="mt-3 break-words text-base font-semibold leading-7 text-white sm:text-lg sm:leading-8">{section.description}</p></div></CardHeader><CardContent className="min-w-0 p-5 min-[390px]:p-7 sm:p-10"><header className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><ProfileCheckIcon className="size-5" /></span><p className="break-words text-sm font-bold uppercase tracking-[0.14em] text-emerald-700 min-[390px]:tracking-[0.18em]">Misi yang dikerjakan bersama</p></header><ol className="mt-6 space-y-2 min-[390px]:mt-7 min-[390px]:space-y-3">{(section.items ?? []).map((mission, index) => <li key={`${mission.title}-${index}`} className="profile-mission-item flex min-w-0 gap-3 rounded-2xl border border-transparent px-2 py-3 text-slate-600 transition-colors hover:border-emerald-100 hover:bg-emerald-50/60 min-[390px]:gap-4 min-[390px]:px-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">{String(index + 1).padStart(2, "0")}</span><span className="break-words pt-0.5 leading-7">{mission.title}</span></li>)}</ol></CardContent></Card></section>
}

export function GovernmentCtaSection({ section }: { section?: CmsSection }) {
  if (!section) return null
  return <aside aria-labelledby="government-cta-title"><Card className="profile-structure-cta my-10 min-w-0 rounded-3xl border-emerald-200 bg-emerald-50 shadow-sm min-[390px]:my-12 min-[390px]:rounded-[2rem] sm:my-16"><CardContent className="p-5 min-[390px]:p-6 sm:p-10"><div className="flex min-w-0 flex-col gap-6 md:flex-row md:items-center md:justify-between"><div className="min-w-0 space-y-3"><p className="inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-bold text-emerald-800"><ProfileBuildingIcon className="h-3.5 w-3.5 shrink-0" /><span className="break-words">{section.eyebrow}</span></p><h2 id="government-cta-title" className="max-w-xl break-words text-[clamp(1.5rem,7vw,1.875rem)] font-black leading-tight tracking-tight text-slate-950">{section.title}</h2><p className="max-w-2xl break-words text-sm leading-6 text-slate-600">{section.description}</p></div><Button asChild size="lg" className="profile-cta-button h-auto w-full shrink-0 rounded-2xl px-4 py-4 text-center shadow-lg shadow-emerald-700/20 hover:shadow-xl min-[390px]:px-6 md:w-auto"><Link href={section.href ?? "#"}><span className="break-words">{section.action}</span><ProfileArrowRightIcon className="h-5 w-5 shrink-0" /></Link></Button></div></CardContent></Card></aside>
}
