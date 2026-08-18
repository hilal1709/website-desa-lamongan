import "server-only"

import { unstable_cache } from "next/cache"
import { prisma } from "@/app/lib/prisma"
import type { UmkmCatalogItem, UmkmCategoryStat, UmkmProduct, UmkmPublicData } from "@/types"

const publicProduct = { id: true, name: true, description: true, imageUrl: true, price: true, isAvailable: true } as const
const emptyUmkmData: UmkmPublicData = { catalog: [], categories: [], totalBusinesses: 0, totalProducts: 0 }

function normalizedCategory(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID")
}

export const getCachedUmkmData = unstable_cache(async (): Promise<UmkmPublicData> => {
  try {
    const businesses = await prisma.umkm.findMany({
      where: { isPublished: true },
      select: { id: true, name: true, slug: true, category: true, description: true, logoUrl: true, whatsapp: true, address: true, products: { where: { isAvailable: true }, select: { id: true } } },
      orderBy: { name: "asc" },
    })
    const categoryMap = new Map<string, UmkmCategoryStat>()
    const catalog = businesses.map((business) => {
      const key = normalizedCategory(business.category)
      const existing = categoryMap.get(key) ?? { category: business.category.trim(), businesses: 0, products: 0 }
      existing.businesses += 1
      existing.products += business.products.length
      categoryMap.set(key, existing)
      return { ...business, productCount: business.products.length }
    })
    const categories = [...categoryMap.values()].sort((a, b) => b.businesses - a.businesses || a.category.localeCompare(b.category, "id"))
    return { catalog, categories, totalBusinesses: catalog.length, totalProducts: catalog.reduce((total, item) => total + item.productCount, 0) }
  } catch {
    return emptyUmkmData
  }
}, ["umkm-public"], { revalidate: 60, tags: ["umkm"] })

export const getCachedUmkmBySlug = (slug: string) => unstable_cache(async () => {
  try {
    const business = await prisma.umkm.findFirst({
      where: { slug, isPublished: true },
      select: { id: true, name: true, slug: true, category: true, description: true, logoUrl: true, whatsapp: true, address: true, products: { where: { isAvailable: true }, select: publicProduct, orderBy: { name: "asc" } } },
    })
    return business ? { ...business, products: business.products as UmkmProduct[] } : null
  } catch {
    return null
  }
}, ["umkm-detail", slug], { revalidate: 60, tags: ["umkm"] })()
