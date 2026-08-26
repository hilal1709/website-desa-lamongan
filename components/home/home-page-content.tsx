import Link from "next/link"

import { AnimatedHero } from "@/components/home/animated-hero"
import { HomeJsonLd } from "@/components/home/home-json-ld"
import { HomeMotion } from "@/components/home/home-motion"
import { HomeOverviewSection } from "@/components/home/home-overview-section"
import { NewsCard } from "@/components/home/news-card"
import { ServiceCard } from "@/components/home/service-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import type { HomePageModel } from "@/lib/home-page"

const EmptyState = ({ children }: { children: string }) => <Card className="border-dashed border-slate-300 bg-white/70 p-7 text-center"><p className="font-bold text-slate-800">{children}</p></Card>

function StatisticsSection({ stats }: Pick<HomePageModel, "stats">) {
  return <section aria-label="Statistik Desa Kedungrejo" className="relative z-10 -mt-10 mx-4 grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-emerald-950/10 shadow-2xl shadow-emerald-950/15 sm:mx-6 md:mx-auto md:grid-cols-4">{stats.map((stat) => { const Icon = stat.icon; return <Card key={stat.label} className="home-stat rounded-none border-0 bg-white/95 p-5 shadow-none sm:p-6"><Icon className="text-emerald-700" size={21} strokeWidth={2.4} /><p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{stat.value}</p><p className="mt-1 text-sm font-bold text-slate-700">{stat.label}</p></Card> })}</section>
}

function ServicesSection({ services, section }: Pick<HomePageModel, "services"> & { section: HomePageModel["sections"]["services"] }) {
  return <section id="layanan-utama" aria-labelledby="home-services-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"><div className="home-section-heading"><SectionHeading id="home-services-heading" eyebrow={section?.eyebrow ?? "Layanan"} title={section?.title ?? "Layanan Desa"} description={section?.description} href={section?.href} action={section?.action} /></div>{services.length ? <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{services.map((service) => <li key={service.title} className="home-service-card"><ServiceCard service={service} /></li>)}</ul> : <EmptyState>Belum ada layanan yang ditampilkan</EmptyState>}</section>
}

function DigitalSection({ section }: { section: HomePageModel["sections"]["digital"] }) {
  const items = section?.items ?? []
  return <section aria-labelledby="home-digital-heading" className="relative overflow-hidden bg-[#eaf4ed] py-12 sm:py-16"><div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-emerald-200/45 blur-3xl" /><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="home-section-heading"><SectionHeading id="home-digital-heading" eyebrow={section?.eyebrow ?? "Desa digital"} title={section?.title ?? "Desa Digital"} description={section?.description} href={section?.href} action={section?.action} /></div>{items.length ? <ol className="grid gap-6 lg:grid-cols-3">{items.map((item, index) => <li key={item.title}><Card className="home-digital-card home-interactive-card relative h-full overflow-hidden border-white/80 bg-white/85 shadow-[0_8px_24px_rgba(15,59,47,0.05)]"><div className="home-card-glow pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-200/45 opacity-45 blur-xl" /><CardHeader><div aria-hidden="true" className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-lg font-black text-emerald-700">{String(index + 1).padStart(2, "0")}</div><CardTitle className="text-xl">{item.title}</CardTitle></CardHeader><CardContent><CardDescription className="text-sm leading-6">{item.description}</CardDescription></CardContent></Card></li>)}</ol> : <EmptyState>Belum ada informasi digital</EmptyState>}</div></section>
}

function NewsSection({ news, section }: Pick<HomePageModel, "news"> & { section: HomePageModel["sections"]["news"] }) {
  return <section aria-labelledby="home-news-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"><div className="home-section-heading"><SectionHeading id="home-news-heading" eyebrow={section?.eyebrow ?? "Berita"} title={section?.title ?? "Berita Desa"} description={section?.description} href={section?.href} action={section?.action} /></div>{news.length ? <ul className="grid gap-5 md:grid-cols-3">{news.map((item, index) => <li key={item.title} className={`home-news-card ${index === 0 ? "md:col-span-2" : ""}`}><NewsCard item={item} featured={index === 0} /></li>)}</ul> : <EmptyState>Belum ada berita dipublikasikan</EmptyState>}</section>
}

const ctaActionClass = "w-full shadow-sm focus-visible:ring-white focus-visible:ring-offset-[#0b3d31] sm:w-auto"
const ctaSecondaryActionClass = `${ctaActionClass} border-white/50 bg-white/15 text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] hover:border-white/70 hover:bg-white/25 hover:text-white`

function CallToAction({ section }: { section: HomePageModel["sections"]["cta"] }) {
  return (
    <section aria-labelledby="home-cta-heading" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <Card className="home-cta home-interactive-card relative overflow-hidden border-0 bg-[#0b3d31] text-white shadow-xl shadow-emerald-950/15">
        <div className="home-card-glow pointer-events-none absolute -right-10 -top-12 h-52 w-52 rounded-full bg-emerald-300/20 opacity-45 blur-2xl" />
        <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">{section?.eyebrow ?? "Layanan warga"}</p>
            <h2 id="home-cta-heading" className="mt-2 text-3xl font-black">{section?.title ?? "Mari wujudkan desa yang lebih maju dan terbuka."}</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className={`${ctaActionClass} bg-emerald-300 text-emerald-950 hover:bg-emerald-200`}>
              <Link href="/layanan">Layanan desa</Link>
            </Button>
            <Button asChild variant="outline" className={ctaSecondaryActionClass}>
              <Link href="/aduan">Kirim aspirasi</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export function HomePageContent({ model }: { model: HomePageModel }) {
  return <main id="konten-utama"><HomeJsonLd /><div className="-mt-[88px]"><AnimatedHero content={model.hero} /></div><HomeMotion><div className="home-page bg-[#f3f7f3]"><StatisticsSection stats={model.stats} /><ServicesSection services={model.services} section={model.sections.services} /><DigitalSection section={model.sections.digital} /><HomeOverviewSection pages={model.pages} digitalItems={model.sections.digital?.items ?? []} documents={model.documents} services={model.services} residentSummary={model.residentSummary} /><NewsSection news={model.news} section={model.sections.news} /><CallToAction section={model.sections.cta} /></div></HomeMotion></main>
}
