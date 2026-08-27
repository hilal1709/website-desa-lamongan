import type { ServiceCatalogItem } from "@/lib/village-services"

export function LayananJsonLd({ services }: { services: ServiceCatalogItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Layanan Desa Kedungrejo",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        url: `/layanan/${service.slug}`,
        provider: { "@type": "GovernmentOrganization", name: "Pemerintah Desa Kedungrejo" },
      },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
}
