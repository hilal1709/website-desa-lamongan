import type { Metadata } from "next"
import dynamicComponent from "next/dynamic"
import { ArchiveJsonLd } from "@/components/arsip/archive-json-ld"
import { PageHero } from "@/components/ui/page-hero"
import { getCmsPage } from "@/lib/cms-pages"
import { getArchiveDocuments } from "@/lib/archive-data"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Arsip Dokumen Publik | Desa Kedungrejo",
  description: "Akses dan unduh dokumen publik Pemerintah Desa Kedungrejo secara terbuka.",
  alternates: { canonical: "/arsip" },
  openGraph: { title: "Arsip Dokumen Publik Desa Kedungrejo", description: "Dokumen publik yang dapat diakses dan diunduh warga.", type: "website" },
}

const PublicDocumentArchive = dynamicComponent(
  () => import("@/components/arsip/public-document-archive").then((module) => module.PublicDocumentArchive),
  { loading: () => <div className="mx-auto -mt-10 h-72 max-w-7xl animate-pulse rounded-[2rem] bg-white/70 shadow-sm" /> },
)

export default async function Arsip() {
  const [hero, documents] = await Promise.all([getCmsPage("arsip"), getArchiveDocuments()])
  const notice = hero.sections.find((item) => item.key === "notice")
  const publicDocuments = documents.map((document) => ({ id: document.id, title: document.title, meta: `${document.type} - ${document.size}`, status: "Publik" }))

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} />

      <ArchiveJsonLd documents={publicDocuments} />
      <PublicDocumentArchive documents={publicDocuments} notice={notice?.title} />
    </>
  )
}
