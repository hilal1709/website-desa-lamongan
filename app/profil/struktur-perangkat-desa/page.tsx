import type { Metadata } from "next"
import { cache } from "react"

import { StrukturPerangkatDesaContent } from "@/components/profil/struktur-perangkat-desa-content"
import { getCmsPage } from "@/lib/cms-pages"

export const dynamic = "force-dynamic"
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
  return <StrukturPerangkatDesaContent page={await getStructurePage()} />
}
