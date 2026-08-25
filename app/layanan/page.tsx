import type { Metadata } from "next"
import { VillageServiceCatalog } from "@/components/layanan/village-service-catalog"
import { PageHero } from "@/components/ui/page-hero"
import { getCmsPage } from "@/lib/cms-pages"
import { getActiveVillageServices } from "@/lib/village-services"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Layanan Desa | Kedungrejo",
  description: "Akses layanan administrasi, kependudukan, kesehatan, dan usaha dari Pemerintah Desa Kedungrejo.",
  alternates: { canonical: "/layanan" },
  openGraph: { type: "website", locale: "id_ID", title: "Layanan Desa | Kedungrejo", description: "Akses layanan administrasi dan informasi warga Desa Kedungrejo." },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
}

export default async function Layanan() {
  const hero = await getCmsPage("layanan")
  const services = await getActiveVillageServices()

  return (
    <main>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} />
      <VillageServiceCatalog services={services} />
    </main>
  )
}
