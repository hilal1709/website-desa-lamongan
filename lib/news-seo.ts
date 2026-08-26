import type { Metadata } from "next"
import type { NewsArticle } from "@/types"

const siteName = "Pemerintah Desa Kedungrejo"

export const newsIndexMetadata: Metadata = {
  title: "Berita Desa | Kedungrejo",
  description: "Berita, pengumuman, dan kegiatan terbaru dari Pemerintah Desa Kedungrejo.",
  alternates: { canonical: "/berita" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Berita Desa | Kedungrejo",
    description: "Berita, pengumuman, dan kegiatan terbaru dari Pemerintah Desa Kedungrejo.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
}

export function createNewsArticleMetadata(article: NewsArticle): Metadata {
  const description = article.excerpt || `Berita Desa Kedungrejo: ${article.title}`
  const image = article.image_url ? [{ url: article.image_url, alt: article.title }] : undefined

  return {
    title: `${article.title} | Berita Desa Kedungrejo`,
    description,
    alternates: { canonical: `/berita/${article.slug}` },
    openGraph: {
      type: "article",
      locale: "id_ID",
      title: article.title,
      description,
      publishedTime: article.created_at,
      authors: [siteName],
      images: image,
    },
    twitter: { card: "summary_large_image", title: article.title, description, images: article.image_url ? [article.image_url] : undefined },
  }
}

export function createNewsArticleJsonLd(article: NewsArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt || undefined,
    datePublished: article.created_at,
    dateModified: article.created_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": `/berita/${article.slug}` },
    image: article.image_url || undefined,
    author: { "@type": "Organization", name: siteName },
    publisher: { "@type": "Organization", name: siteName },
    inLanguage: "id-ID",
  }
}
