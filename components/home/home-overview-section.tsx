import { HeartPulse, Landmark, MapPinned, Newspaper, ShieldAlert } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import type { CmsPageContent, CmsSectionItem } from "@/lib/cms-pages"
import type { Document } from "@/generated/prisma/client"
import type { Service } from "@/types"

interface HomeOverviewSectionProps {
  pages: Map<string, CmsPageContent>
  digitalItems: CmsSectionItem[]
  documents: Document[]
  services: Service[]
  residentSummary: { label: string; value: number }[]
}

export function HomeOverviewSection({ pages, digitalItems, documents, services: liveServices, residentSummary }: HomeOverviewSectionProps) {
  const profile = pages.get("profil")
  const services = pages.get("layanan")
  const governmentCta = profile?.sections.find((section) => section.key === "government-cta")
  const government = governmentCta ? [{ title: governmentCta.title ?? "", description: governmentCta.description }] : []
  const serviceItems = liveServices.length > 0 ? liveServices.map((service) => service.title) : []

  return (
    <section aria-labelledby="village-overview-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="home-section-heading">
        <SectionHeading id="village-overview-heading" eyebrow="Sekilas Kedungrejo" title="Informasi penting dalam satu beranda" description="Cuplikan informasi dari halaman pemerintahan, layanan, data, kesehatan, arsip, hingga kesiapsiagaan desa." />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="home-overview-card min-w-0 border-slate-200"><CardHeader><div className="flex items-center gap-3"><Landmark className="shrink-0 text-emerald-700" /><CardTitle>Pemerintahan & profil desa</CardTitle></div></CardHeader><CardContent className="space-y-4"><p className="leading-7 text-slate-600">{profile?.description}</p><div className="grid gap-2 sm:grid-cols-3">{government.slice(0, 3).map((item) => <div key={item.title} className="min-w-0 rounded-xl bg-slate-50 p-3"><p className="break-words font-bold text-slate-800">{item.title}</p><p className="mt-1 break-words text-sm text-slate-500">{item.description}</p></div>)}</div></CardContent></Card>
        <Card className="home-overview-card border-slate-200"><CardHeader><div className="flex items-center gap-3"><Landmark className="text-emerald-700" /><CardTitle>Layanan & aspirasi warga</CardTitle></div></CardHeader><CardContent className="space-y-4"><p className="leading-7 text-slate-600">{services?.description}</p><div className="flex flex-wrap gap-2">{serviceItems.length ? serviceItems.map((title) => <span key={title} className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">{title}</span>) : <p className="text-sm text-slate-500">Belum ada layanan aktif.</p>}</div><p className="text-sm text-slate-500">Aduan warga dapat disampaikan dengan identitas yang dijaga dan ditindaklanjuti oleh desa.</p></CardContent></Card>
        <Card className="home-overview-card border-slate-200"><CardHeader><div className="flex items-center gap-3"><HeartPulse className="text-emerald-700" /><CardTitle>Data penduduk & kesehatan</CardTitle></div></CardHeader><CardContent><div className="grid grid-cols-2 gap-3">{residentSummary.map((item) => <div key={item.label} className="rounded-xl bg-slate-50 p-3"><p className="text-2xl font-black text-slate-900">{new Intl.NumberFormat("id-ID").format(item.value)}</p><p className="mt-1 text-sm font-semibold text-slate-700">{item.label}</p><p className="mt-1 text-xs text-slate-500">{item.value ? "Data warga aktif" : "Belum ada data"}</p></div>)}</div><p className="mt-4 text-sm leading-6 text-slate-600">Statistik ini menggunakan sumber data warga aktif yang sama dengan halaman Infografis Desa.</p></CardContent></Card>
        <Card className="home-overview-card border-slate-200"><CardHeader><div className="flex items-center gap-3"><Newspaper className="text-emerald-700" /><CardTitle>Berita & arsip publik</CardTitle></div></CardHeader><CardContent><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Dokumen publik terbaru</p>{documents.length ? documents.map((item) => <p key={item.id} className="mt-3 text-sm font-semibold leading-6 text-slate-700">{item.title} <span className="font-normal text-slate-500">· {item.type} · {item.size}</span></p>) : <p className="mt-3 text-sm text-slate-500">Belum ada dokumen publik.</p>}</CardContent></Card>
        <Card className="home-overview-card border-slate-200"><CardHeader><div className="flex items-center gap-3"><MapPinned className="text-emerald-700" /><CardTitle>Desa digital & infografis</CardTitle></div></CardHeader><CardContent><p className="leading-7 text-slate-600">{pages.get("infografis")?.description}</p><ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">{digitalItems.map((item) => <li key={item.title} className="flex gap-2"><span className="text-emerald-600">•</span>{item.title}</li>)}</ul></CardContent></Card>
        <Card className="home-overview-card border-slate-200"><CardHeader><div className="flex items-center gap-3"><ShieldAlert className="text-emerald-700" /><CardTitle>Kesiapsiagaan bencana</CardTitle></div></CardHeader><CardContent><p className="leading-7 text-slate-600">Pantau prakiraan cuaca, kalender iklim petani, titik rawan, posko evakuasi, serta akses bantuan darurat dalam satu layanan kesiapsiagaan.</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">Prakiraan cuaca</span><span className="rounded-full bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">Peta evakuasi</span><span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">Panduan petani</span></div></CardContent></Card>
      </div>
    </section>
  )
}
