import type { Metadata } from "next"

import { HomePageContent } from "@/components/home/home-page-content"
import { getHomePageModel } from "@/lib/home-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Desa Kedungrejo | Portal Informasi dan Layanan",
  description: "Portal resmi Desa Kedungrejo untuk informasi pemerintahan, layanan warga, data desa, dan berita terkini.",
  keywords: ["Desa Kedungrejo", "Lamongan", "layanan desa", "informasi desa", "pemerintah desa"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Desa Kedungrejo | Portal Informasi dan Layanan",
    description: "Informasi pemerintahan, layanan warga, data desa, dan berita terkini Desa Kedungrejo.",
    locale: "id_ID",
    type: "website",
    url: "/",
    images: [{ url: "/images/dorr.jpg", alt: "Hamparan sawah Desa Kedungrejo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Kedungrejo | Portal Informasi dan Layanan",
    description: "Informasi pemerintahan, layanan warga, data desa, dan berita terkini Desa Kedungrejo.",
    images: ["/images/dorr.jpg"],
  },
}

export default async function Home() {
  return <HomePageContent model={await getHomePageModel()} />
}
