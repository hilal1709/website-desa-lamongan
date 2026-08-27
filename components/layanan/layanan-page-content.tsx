import { LayananJsonLd } from "@/components/layanan/layanan-json-ld"
import { VillageServiceCatalog } from "@/components/layanan/village-service-catalog"
import { PageHero } from "@/components/ui/page-hero"
import type { CmsPageContent } from "@/lib/cms-pages"
import type { ServiceCatalogItem } from "@/lib/village-services"

interface LayananPageContentProps {
  hero: CmsPageContent
  services: ServiceCatalogItem[]
}

export function LayananPageContent({ hero, services }: LayananPageContentProps) {
  return (
    <main id="main-content">
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={hero.image}
        imagePosition={hero.imagePosition}
      />
      <LayananJsonLd services={services} />
      <section aria-label="Katalog layanan desa">
        <VillageServiceCatalog services={services} />
      </section>
    </main>
  )
}
