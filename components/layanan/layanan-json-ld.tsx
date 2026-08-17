import type { CmsSectionItem } from "@/lib/cms-pages"

export function LayananJsonLd({ services }: { services: CmsSectionItem[] }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "ItemList", name: "Layanan Desa Kedungrejo", itemListElement: services.map((service, index) => ({ "@type": "ListItem", position: index + 1, item: { "@type": "Service", name: service.title, description: service.description || undefined, url: service.href || "/layanan-digital", provider: { "@type": "GovernmentOrganization", name: "Pemerintah Desa Kedungrejo" } } })) }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
