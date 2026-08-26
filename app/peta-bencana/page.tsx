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

export const dynamic = "force-dynamic"

export default async function PetaBencanaPage() {
  return <DisasterPage hero={await getCmsPage("peta-bencana")} />
}
