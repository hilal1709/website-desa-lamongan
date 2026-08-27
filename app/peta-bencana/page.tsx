import type { Metadata } from "next"
import { DisasterPage } from "@/components/bencana/disaster-page"
import { getCmsPage } from "@/lib/cms-pages"

export const metadata: Metadata = {
  title: "Peta Lokasi Bencana dan Cuaca Kedungrejo",
  description: "Pantau prakiraan cuaca realtime, titik evakuasi, posko, dan zona rawan bencana di Desa Kedungrejo.",
  keywords: ["peta bencana", "cuaca Kedungrejo", "evakuasi", "posko bencana", "Desa Kedungrejo"],
  openGraph: {
    title: "Peta Lokasi Bencana dan Cuaca Kedungrejo",
    description: "Informasi cuaca realtime, titik evakuasi, posko, dan zona rawan Desa Kedungrejo.",
    images: [{ url: "/images/peta-bencana-hero.png", width: 1823, height: 863, alt: "Sawah dan permukiman Desa Kedungrejo saat cuaca mendung" }],
  },
}

// CMS hero content is cached separately and this shell can be regenerated
// periodically instead of rendering on every public request.
export const revalidate = 300

export default async function PetaBencanaPage() {
  const hero = await getCmsPage("peta-bencana")
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Peta Lokasi Bencana dan Cuaca Kedungrejo",
    description: metadata.description,
    about: { "@type": "GovernmentService", name: "Informasi kesiapsiagaan bencana Desa Kedungrejo" },
    primaryImageOfPage: hero.image,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <DisasterPage hero={hero} />
    </>
  )
}
