import type { Metadata } from "next"
import { LayananContent } from "@/components/layanan/layanan-content"
import { LayananJsonLd } from "@/components/layanan/layanan-json-ld"
import { PageHero } from "@/components/ui/page-hero"
import { getCmsPage } from "@/lib/cms-pages"

export const revalidate = 3600

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
  const section = (key: string) => hero.sections.find((item) => item.key === key)
  const servicesSection = section("service-cards")
  const flowSection = section("flow")

  return (
    <main>
      <LayananJsonLd services={servicesSection?.items ?? []} />
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} />

      <LayananContent
        services={servicesSection?.items ?? []}
        flowTitle={flowSection?.title}
        flowItems={flowSection?.items ?? []}
      />
    </main>
  )
}
