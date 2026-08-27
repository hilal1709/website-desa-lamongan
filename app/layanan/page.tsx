import type { Metadata } from "next"
import { LayananPageContent } from "@/components/layanan/layanan-page-content"
import { getCmsPage } from "@/lib/cms-pages"
import { getActiveVillageServices } from "@/lib/village-services"

export const metadata: Metadata = {
  title: "Layanan Desa | Kedungrejo",
  description: "Akses layanan administrasi, kependudukan, kesehatan, dan usaha dari Pemerintah Desa Kedungrejo.",
  alternates: { canonical: "/layanan" },
  keywords: ["layanan desa", "layanan administrasi", "surat desa online", "Desa Kedungrejo"],
  openGraph: { type: "website", locale: "id_ID", title: "Layanan Desa | Kedungrejo", description: "Akses layanan administrasi dan informasi warga Desa Kedungrejo.", url: "/layanan" },
  twitter: { card: "summary_large_image", title: "Layanan Desa | Kedungrejo", description: "Akses layanan administrasi dan informasi warga Desa Kedungrejo." },
  robots: { index: true, follow: true },
}

export default async function Layanan() {
  const [hero, services] = await Promise.all([getCmsPage("layanan"), getActiveVillageServices()])
  return <LayananPageContent hero={hero} services={services} />
}
