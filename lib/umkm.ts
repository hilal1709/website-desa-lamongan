import "server-only"

import { prisma } from "@/app/lib/prisma"
import type { UmkmCatalogItem, UmkmCategoryStat, UmkmProduct, UmkmPublicData } from "@/types"

const publicProduct = { id: true, name: true, description: true, imageUrl: true, price: true, isAvailable: true } as const
const emptyUmkmData: UmkmPublicData = { catalog: [], categories: [], hamlets: [], yearly: [], totalBusinesses: 0, totalProducts: 0 }

function normalizedCategory(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID")
}

export async function getCachedUmkmData(): Promise<UmkmPublicData> {
  try {
    const businesses = await prisma.umkm.findMany({
      where: { isPublished: true },
      select: { id: true, name: true, slug: true, category: true, description: true, logoUrl: true, whatsapp: true, address: true, dusun: true, registeredAt: true, products: { where: { isAvailable: true }, select: { id: true } } },
      orderBy: { name: "asc" },
    })
    const categoryMap = new Map<string, UmkmCategoryStat>()
    const catalog = businesses.map((business) => {
      const key = normalizedCategory(business.category)
      const existing = categoryMap.get(key) ?? { category: business.category.trim(), businesses: 0, products: 0 }
      existing.businesses += 1
      existing.products += business.products.length
      categoryMap.set(key, existing)
      return { ...business, registeredAt: business.registeredAt.toISOString(), productCount: business.products.length }
    })
    const categories = [...categoryMap.values()].sort((a, b) => b.businesses - a.businesses || a.category.localeCompare(b.category, "id"))
    const annualAdditions = new Map<number, number>()
    for (const business of catalog) {
      const year = new Date(business.registeredAt).getUTCFullYear()
      annualAdditions.set(year, (annualAdditions.get(year) ?? 0) + 1)
    }
    let total = 0
    const yearly = [...annualAdditions.entries()].sort(([a], [b]) => a - b).map(([year, added]) => ({ year, added, total: total += added }))
    const hamlets = [...new Set(catalog.map((business) => business.dusun).filter((dusun) => dusun !== "Belum ditentukan"))].sort((a, b) => a.localeCompare(b, "id"))
    return { catalog, categories, hamlets, yearly, totalBusinesses: catalog.length, totalProducts: catalog.reduce((total, item) => total + item.productCount, 0) }
  } catch (error) {
    console.error("Gagal memuat data UMKM publik.", error)
    return emptyUmkmData
  }
}

export async function getCachedUmkmBySlug(slug: string) {
  try {
    const business = await prisma.umkm.findFirst({
      where: { slug, isPublished: true },
      select: { id: true, name: true, slug: true, category: true, description: true, logoUrl: true, whatsapp: true, address: true, products: { where: { isAvailable: true }, select: publicProduct, orderBy: { name: "asc" } } },
    })
    return business ? { ...business, products: business.products as UmkmProduct[] } : null
  } catch {
    return null
  }
}
