import Link from "next/link"
import type { Metadata } from "next"
import { Building2, FileText, Landmark, MessageCircle, Users } from "lucide-react"

import { AnimatedHero } from "@/components/home/animated-hero"
import { HomeMotion } from "@/components/home/home-motion"
import { HomeOverviewSection } from "@/components/home/home-overview-section"
import { NewsCard } from "@/components/home/news-card"
import { ServiceCard } from "@/components/home/service-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeading } from "@/components/ui/section-heading"
import { getCmsPage, getCmsPages } from "@/lib/cms-pages"
import { getHomeData } from "@/lib/home-data"
import type { NewsItem, Service, Stat } from "@/types"

const statIcons = [Users, Building2, FileText, Landmark]
const serviceIcons = [FileText, Users, MessageCircle, Landmark]
const serviceTones: Service["tone"][] = ["blue", "emerald", "amber", "blue"]

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Desa Kedungrejo | Portal Informasi dan Layanan",
  description: "Portal resmi Desa Kedungrejo untuk informasi pemerintahan, layanan warga, data desa, dan berita terkini.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Desa Kedungrejo | Portal Informasi dan Layanan",
    description: "Informasi pemerintahan, layanan warga, data desa, dan berita terkini Desa Kedungrejo.",
    locale: "id_ID",
    type: "website",
  },
}

export default async function Home() {
  const [hero, cmsPages, homeData] = await Promise.all([getCmsPage("home"), getCmsPages(), getHomeData()])
  const contentBySlug = new Map(cmsPages.map((page) => [page.slug, page]))
  const section = (key: string) => hero.sections.find((item) => item.key === key)
  const servicesSection = section("services")
  const digitalSection = section("digital")
  const newsSection = section("news")
  const ctaSection = section("cta")
  const statsSection = section("stats")

  // Statistik dihitung dari warga aktif dan pengajuan layanan. Fallback nol
  // hanya digunakan ketika koneksi basis data belum tersedia.
  const statisticItems = homeData.statistics.length > 0
    ? homeData.statistics.map((item) => ({ label: item.label, value: item.value, detail: "" }))
    : (statsSection?.items ?? []).map((item) => ({ label: item.title, value: "0", detail: "" }))

  const stats: Stat[] = statisticItems.map((item, index) => ({
    label: item.label,
    value: item.value,
    detail: "",
    icon: statIcons[index] ?? Users,
  }))

  const services: Service[] = homeData.services.map((item, index) => ({
    title: item.title,
    description: item.description,
    href: `/layanan/${item.slug}`,
    icon: serviceIcons[index] ?? FileText,
    tone: serviceTones[index] ?? "emerald",
  }))

  const news: NewsItem[] = homeData.news.map((item) => ({
    title: item.title,
    category: item.category ?? "Berita desa",
    date: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.created_at)),
    image: item.image_url ?? "",
    excerpt: item.excerpt ?? "",
  }))
  const residentSummary = [
    { label: "Jumlah penduduk", value: homeData.residentSummary.population },
    { label: "Kepala keluarga", value: homeData.residentSummary.households },
    { label: "Laki-laki", value: homeData.residentSummary.male },
    { label: "Perempuan", value: homeData.residentSummary.female },
  ]

  return (
    <main>
      <div className="-mt-[88px]">
        <AnimatedHero content={hero} />
      </div>
      <HomeMotion>
      <div className="home-page bg-[#f3f7f3]">
        {stats.length > 0 && <section aria-label="Statistik desa" className="relative z-10 -mt-10 mx-4 grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-emerald-950/10 shadow-2xl shadow-emerald-950/15 sm:mx-6 md:mx-auto md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="home-stat rounded-none border-0 bg-white/95 p-5 shadow-none sm:p-6">
                <Icon className="text-emerald-700" size={21} strokeWidth={2.4} />
                <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-slate-700">{stat.label}</p>
                {stat.detail && <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>}
              </Card>
            )
          })}
        </section>}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="home-section-heading"><SectionHeading eyebrow={servicesSection?.eyebrow ?? ""} title={servicesSection?.title ?? ""} description={servicesSection?.description} href={servicesSection?.href} action={servicesSection?.action} /></div>
        {services.length > 0 ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}</div> : <Card className="home-service-card border-dashed border-emerald-200 bg-white/70 p-7 text-center"><p className="font-bold text-slate-800">Belum ada layanan yang ditampilkan</p><p className="mt-2 text-sm text-slate-500">Layanan akan muncul setelah dikelola oleh admin desa.</p></Card>}
      </section>

      <section className="relative overflow-hidden bg-[#eaf4ed] py-12 sm:py-16">
        <div className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="home-section-heading"><SectionHeading eyebrow={digitalSection?.eyebrow ?? ""} title={digitalSection?.title ?? ""} description={digitalSection?.description} href={digitalSection?.href} action={digitalSection?.action} /></div>

          {(digitalSection?.items?.length ?? 0) > 0 ? <div className="grid gap-6 lg:grid-cols-3">
            {(digitalSection?.items ?? []).map((item, index) => (
              <Card key={item.title} className="home-digital-card relative overflow-hidden border-white/80 bg-white/85 shadow-[0_8px_24px_rgba(15,59,47,0.05)] transition hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-lg font-black text-emerald-700">
                    0{index + 1}
                  </div>
                  <CardTitle className="text-xl text-slate-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-6 text-slate-500">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div> : <Card className="home-digital-card border-dashed border-emerald-200 bg-white/70 p-7 text-center"><p className="font-bold text-slate-800">Belum ada informasi digital</p><p className="mt-2 text-sm text-slate-500">Konten akan tampil setelah dikelola oleh admin desa.</p></Card>}
        </div>
      </section>

      <HomeOverviewSection pages={contentBySlug} digitalItems={digitalSection?.items ?? []} documents={homeData.documents} services={services} residentSummary={residentSummary} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="home-section-heading"><SectionHeading eyebrow={newsSection?.eyebrow ?? ""} title={newsSection?.title ?? ""} description={newsSection?.description} href={newsSection?.href} action={newsSection?.action} /></div>
        {news.length > 0 ? <div className="grid gap-5 md:grid-cols-3">{news.map((item, index) => (
            <NewsCard key={item.title} item={item} featured={index === 0} />
          ))}</div> : <Card className="home-news-card border-dashed border-slate-300 bg-white/70 p-7 text-center"><p className="font-bold text-slate-800">Belum ada berita dipublikasikan</p><p className="mt-2 text-sm text-slate-500">Berita terbaru akan tampil di sini setelah diterbitkan.</p></Card>}
      </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <Card className="home-cta overflow-hidden border-0 bg-[#0b3d31] text-white shadow-xl shadow-emerald-950/15">
            <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">{ctaSection?.eyebrow}</p>
                <h3 className="mt-2 text-3xl font-black text-white">{ctaSection?.title}</h3>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild variant="default" className="w-full bg-emerald-300 text-emerald-950 hover:bg-emerald-200 sm:w-auto">
                  <Link href="/layanan">Layanan desa</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto">
                  <Link href="/aduan">Kirim aspirasi</Link>
                </Button>
              </div>
          </CardContent>
        </Card>
      </section>
      </div>
      </HomeMotion>
    </main>
  )
}
