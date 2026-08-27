import type { Metadata } from "next"

import { ComplaintJsonLd } from "@/components/aduan/complaint-json-ld"
import { ComplaintPageContent } from "@/components/aduan/complaint-page-content"
import { PageHero } from "@/components/ui/page-hero"
import { getComplaintsPage } from "@/lib/complaints"
import { getCmsPage } from "@/lib/cms-pages"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Aduan Warga | Desa Kedungrejo",
  description: "Sampaikan aduan warga kepada Pemerintah Desa Kedungrejo secara aman dan pantau tindak lanjutnya.",
  alternates: { canonical: "/aduan" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Aduan Warga | Desa Kedungrejo",
    description: "Kirim laporan warga dan pantau tindak lanjut Pemerintah Desa Kedungrejo.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
}

export default async function Aduan() {
  const [hero, complaintPage] = await Promise.all([getCmsPage("aduan"), getComplaintsPage()])
  const formSection = hero.sections.find((item) => item.key === "complaint-form")
  const historySection = hero.sections.find((item) => item.key === "complaint-history")

  return (
    <>
      <ComplaintJsonLd />
      <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} overlayClassName="bg-[#071b1d]/75" />
      <ComplaintPageContent formSection={formSection} historyTitle={historySection?.title} complaintPage={complaintPage} />
    </>
  )
}
