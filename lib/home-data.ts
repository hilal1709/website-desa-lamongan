import { prisma } from "@/app/lib/prisma"
import { unstable_cache } from "next/cache"
import { getActiveVillageServices } from "@/lib/village-services"
import { getNewsPageData } from "@/lib/news-data"
import { getOfficialPopulationSummaryForYear } from "@/lib/population-events"

const number = new Intl.NumberFormat("id-ID")

async function getResidentMetrics() {
  try {
    const now = new Date()
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    const activeResidents = { isActive: true }
    const [residentPopulation, residentHamlets, genders, monthlyServiceSubmissions, officialPopulation] = await Promise.all([
      prisma.resident.count({ where: activeResidents }),
      prisma.resident.groupBy({ by: ["dusun"], where: activeResidents, _count: { _all: true } }),
      prisma.resident.groupBy({ by: ["gender"], where: activeResidents, _count: { _all: true } }),
      prisma.serviceSubmission.count({ where: { createdAt: { gte: monthStart } } }),
      getOfficialPopulationSummaryForYear(now.getUTCFullYear()),
    ])
    const genderCount = (gender: string) => genders.find((item) => item.gender === gender)?._count._all ?? 0
    // Profil warga dapat belum lengkap. Selama data dasar resmi tersedia,
    // angka itulah yang ditayangkan agar konsisten dengan infografis publik.
    const population = officialPopulation.totalPopulation || residentPopulation
    const hamlets = officialPopulation.hamletCount || residentHamlets.length

    const male = officialPopulation.totalPopulation ? officialPopulation.male : genderCount("Laki-laki")
    const female = officialPopulation.totalPopulation ? officialPopulation.female : genderCount("Perempuan")
    return { population, households: officialPopulation.totalHouseholds, hamlets, male, female, monthlyServiceSubmissions }
  } catch (error) {
    console.error("Home resident metrics could not be loaded", error)
    return { population: 0, households: null, hamlets: 0, male: 0, female: 0, monthlyServiceSubmissions: 0 }
  }
}

const getCachedHomeData = unstable_cache(async () => {
  const [metrics, services, newsPage, documents] = await Promise.all([
    getResidentMetrics(),
    getActiveVillageServices().catch(() => []),
    getNewsPageData().catch(() => ({ featured: null, articles: [], count: 0, categories: [], page: 1, totalPages: 1 })),
    prisma.document.findMany({ where: { visibility: "PUBLIC" }, orderBy: { uploadedAt: "desc" }, take: 2 }).catch(() => []),
  ])

  const statistics = [
    { label: "Penduduk", value: number.format(metrics.population) },
    { label: "Kepala Keluarga", value: metrics.households === null ? "—" : number.format(metrics.households) },
    { label: "Layanan bulan ini", value: number.format(metrics.monthlyServiceSubmissions) },
    { label: "Dusun", value: number.format(metrics.hamlets) },
  ]
  const residentSummary = { population: metrics.population, households: metrics.households, male: metrics.male, female: metrics.female }
  const news = [newsPage.featured, ...newsPage.articles].filter((item): item is NonNullable<typeof item> => item !== null).slice(0, 3)

  return { statistics, residentSummary, services, news, documents }
}, ["home-data", "official-demographics-v1"], { revalidate: 300, tags: ["home-data"] })

export async function getHomeData() {
  return getCachedHomeData()
}
