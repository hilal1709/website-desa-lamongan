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

interface BeritaPageProps {
  searchParams: Promise<{ q?: string | string[]; kategori?: string | string[]; halaman?: string | string[] }>
}

function firstQueryValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : value?.[0] ?? ""
}

function getPageNumber(value: string | string[] | undefined) {
  const page = Number(firstQueryValue(value))
  return Number.isInteger(page) && page > 0 ? page : 1
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const params = await searchParams
  const query = firstQueryValue(params.q).slice(0, 100)
  const category = firstQueryValue(params.kategori).slice(0, 80)
  const requestedPage = getPageNumber(params.halaman)
  const { featured: featuredArticle, articles, count, categories, page, totalPages } = await getNewsPageData({ query, category, page: requestedPage })
  const hasActiveFilters = Boolean(query || category)

  return <>
    <PageHero eyebrow="Informasi publik" title="Berita Desa" description={hasActiveFilters ? `${count} berita sesuai pencarian Anda.` : `${count} publikasi terbaru dari Pemerintah Desa Kedungrejo.`} image={featuredArticle?.image_url || "/images/dorr.jpg"} imagePosition="center 42%" />
    <NewsIndexContent featuredArticle={featuredArticle} articles={articles} categories={categories} query={query} category={category} resultCount={count} page={page} totalPages={totalPages} />
  </>
}
