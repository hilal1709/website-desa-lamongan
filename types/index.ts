import type { LucideIcon } from "lucide-react"

export interface NavigationItem { label: string; href: string }
export interface Stat { label: string; value: string; detail: string; icon: LucideIcon }
export interface Service { title: string; description: string; href: string; icon: LucideIcon; tone?: "blue" | "emerald" | "amber" }
export interface NewsItem { title: string; category: string; date: string; image: string; excerpt: string }
export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  image_url: string | null
  category?: string
  published: boolean
  created_at: string
}
export interface InfographicStat {
  id: string
  year: number
  dusun: string
  total_population: number
  total_households: number
  male: number
  female: number
  created_at: string
}
export interface AgeGroupStat { id: string; year: number; dusun: string; age_group: string; total: number }
export interface EducationStat { id: string; year: number; dusun: string; education_level: string; total: number }
export interface OccupationStat { id: string; year: number; dusun: string; occupation: string; total: number }
export interface PopulationTrend { id: string; year: number; total_population: number }
export interface DocumentItem { title: string; category: string; date: string; size: string }
export interface UmkmProductVariant { name: string; price: number }
export interface UmkmProduct { id: string; name: string; description: string; imageUrl: string; price: number; variants: UmkmProductVariant[]; isAvailable: boolean }
export interface UmkmCatalogItem { id: string; name: string; slug: string; category: string; description: string; logoUrl: string; whatsapp: string; address: string | null; dusun: string; registeredAt: string; productCount: number }
export interface UmkmCategoryStat { category: string; businesses: number; products: number }
export interface UmkmYearlyStat { year: number; added: number; total: number }
export interface UmkmPublicData { catalog: UmkmCatalogItem[]; categories: UmkmCategoryStat[]; hamlets: string[]; yearly: UmkmYearlyStat[]; totalBusinesses: number; totalProducts: number }
