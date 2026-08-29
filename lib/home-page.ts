import { HomeBuildingIcon, HomeFileIcon, HomeLandmarkIcon, HomeMessageIcon, HomeUsersIcon } from "@/components/home/home-icons"
import { getCmsPage, getCmsPages, type CmsPageContent, type CmsSection } from "@/lib/cms-pages"
import { getHomeData } from "@/lib/home-data"
import type { NewsItem, Service, Stat } from "@/types"

const statIcons = [HomeUsersIcon, HomeBuildingIcon, HomeFileIcon, HomeLandmarkIcon]
const serviceIcons = [HomeFileIcon, HomeUsersIcon, HomeMessageIcon, HomeLandmarkIcon]
const serviceTones: Service["tone"][] = ["blue", "emerald", "amber", "blue"]

export interface HomePageModel {
  hero: CmsPageContent
  pages: Map<string, CmsPageContent>
  sections: { services?: CmsSection; digital?: CmsSection; news?: CmsSection; cta?: CmsSection }
  stats: Stat[]
  services: Service[]
  news: NewsItem[]
  documents: Awaited<ReturnType<typeof getHomeData>>["documents"]
  residentSummary: { label: string; value: number | null }[]
}

export async function getHomePageModel(): Promise<HomePageModel> {
  const [hero, cmsPages, homeData] = await Promise.all([getCmsPage("home"), getCmsPages(), getHomeData()])
  const section = (key: string) => hero.sections.find((item) => item.key === key)
  const statsSection = section("stats")
  const items = homeData.statistics.length ? homeData.statistics.map((item) => ({ label: item.label, value: item.value })) : (statsSection?.items ?? []).map((item) => ({ label: item.title, value: "0" }))

  return {
    hero,
    pages: new Map(cmsPages.map((page) => [page.slug, page])),
    sections: { services: section("services"), digital: section("digital"), news: section("news"), cta: section("cta") },
    stats: items.map((item, index) => ({ label: item.label, value: item.value, detail: "", icon: statIcons[index] ?? HomeUsersIcon })),
    services: homeData.services.map((item, index) => ({ title: item.title, description: item.description, href: `/layanan/${item.slug}`, icon: serviceIcons[index] ?? HomeFileIcon, tone: serviceTones[index] ?? "emerald" })),
    news: homeData.news.map((item) => ({ title: item.title, category: item.category ?? "Berita desa", date: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(item.created_at)), image: item.image_url ?? "", excerpt: item.excerpt ?? "" })),
    documents: homeData.documents,
    residentSummary: [{ label: "Jumlah penduduk", value: homeData.residentSummary.population }, { label: "Kepala keluarga", value: homeData.residentSummary.households }, { label: "Laki-laki", value: homeData.residentSummary.male }, { label: "Perempuan", value: homeData.residentSummary.female }],
  }
}
