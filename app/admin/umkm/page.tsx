import { redirect } from "next/navigation"

import { UmkmPageHero } from "@/components/admin/umkm/umkm-page-hero"
import { LazyUmkmManager } from "@/components/admin/lazy-cms-editors"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { canAccess, firstPermittedCmsPath } from "@/lib/access-control"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { getCachedAdminUmkm } from "@/lib/admin-umkm-data"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Kelola UMKM", "Kelola profil usaha dan katalog produk UMKM Desa Kedungrejo.")

export default async function AdminUmkmPage() {
  const user = await getCurrentAdmin()
  if (!user || !canAccess(user, "UMKM")) redirect(user ? firstPermittedCmsPath(user) ?? "/login" : "/login")

  const businesses = await getCachedAdminUmkm()
  const productCount = businesses.reduce((total, business) => total + business.products.length, 0)
  const publishedCount = businesses.filter((business) => business.isPublished).length

  return <section data-admin-reveal aria-labelledby="kelola-katalog-umkm-title" className="py-1 sm:py-2"><div className="mx-auto max-w-6xl"><UmkmPageHero businessCount={businesses.length} productCount={productCount} publishedCount={publishedCount} /><Card data-admin-reveal className="mt-5 border-emerald-100 bg-emerald-50/70 shadow-none sm:mt-7"><CardContent className="flex flex-wrap items-center justify-between gap-3 p-4"><div><h2 className="text-sm font-bold text-emerald-950">Alur pengelolaan cepat</h2><p className="mt-1 text-xs leading-5 text-emerald-800">Lengkapi profil, simpan, lalu tambahkan produk pada katalog usaha.</p></div><Button variant="outline" size="sm" asChild><a href="#katalog-umkm">Buka katalog</a></Button></CardContent></Card><section id="katalog-umkm" aria-label="Katalog UMKM" className="mt-5 scroll-mt-5 sm:mt-7"><LazyUmkmManager initialBusinesses={businesses} /></section></div></section>
}
