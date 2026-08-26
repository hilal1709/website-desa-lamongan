import type { Metadata } from "next"
import { cache } from "react"

import { StrukturPerangkatDesaContent } from "@/components/profil/struktur-perangkat-desa-content"
import { getCmsPage } from "@/lib/cms-pages"

export const revalidate = 300
const getStructurePage = cache(() => getCmsPage("struktur-perangkat-desa"))

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStructurePage()

  return {
    title: `${page.title} | Desa Kedungrejo`,
    description: page.description,
    alternates: { canonical: "/profil/struktur-perangkat-desa" },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      locale: "id_ID",
      url: "/profil/struktur-perangkat-desa",
    },
    robots: { index: true, follow: true },
  }
}

export default async function StrukturPerangkatDesaPage() {
  const page = await getStructurePage()
  const diagram = page.sections.find((section) => section.key === "organization-chart")
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: "/profil/struktur-perangkat-desa",
    about: {
      "@type": "GovernmentOrganization",
      name: "Pemerintah Desa Kedungrejo",
      department: diagram?.title ?? page.title,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <StrukturPerangkatDesaContent page={page} />
    </>
  )
}
