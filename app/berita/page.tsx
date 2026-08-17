import type { Metadata } from "next"
import { NewsIndexContent } from "@/components/news/news-index-content"
import { PageHero } from "@/components/ui/page-hero"
import { getNewsPageData } from "@/lib/news-data"

export const metadata: Metadata = {
  title: "Berita Desa | Kedungrejo",
  description: "Berita, pengumuman, dan kegiatan terbaru dari Pemerintah Desa Kedungrejo.",
  alternates: { canonical: "/berita" },
  openGraph: {
    title: "Berita Desa | Kedungrejo",
    description: "Berita, pengumuman, dan kegiatan terbaru dari Pemerintah Desa Kedungrejo.",
    locale: "id_ID",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
}
export const revalidate = 300

export default async function BeritaPage() {
  const { featured: featuredArticle, articles, count } = await getNewsPageData()

  return <>
    <PageHero eyebrow="Informasi publik" title="Berita Desa" description={`${count ?? 0} publikasi terbaru dari Pemerintah Desa Kedungrejo.`} image={featuredArticle?.image_url || "/images/dorr.jpg"} imagePosition="center 42%" />
    <NewsIndexContent featuredArticle={featuredArticle} articles={articles} />
  </>
}
