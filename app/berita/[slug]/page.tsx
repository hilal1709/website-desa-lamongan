import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticlePageContent } from "@/components/news/article-page-content"
import { formatNewsDate } from "@/components/news/news-card"
import { NewsJsonLd } from "@/components/news/news-json-ld"
import { PageHero } from "@/components/ui/page-hero"
import { getPublishedArticle, getRelatedArticles } from "@/lib/news-data"

interface ArticlePageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) return { title: "Berita tidak ditemukan", robots: { index: false, follow: false } }

  const description = article.excerpt || `Berita Desa Kedungrejo: ${article.title}`
  return { title: `${article.title} | Berita Desa Kedungrejo`, description, alternates: { canonical: `/berita/${article.slug}` }, openGraph: { type: "article", locale: "id_ID", title: article.title, description, publishedTime: article.created_at, images: article.image_url ? [{ url: article.image_url, alt: article.title }] : undefined }, twitter: { card: "summary_large_image", title: article.title, description, images: article.image_url ? [article.image_url] : undefined } }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) notFound()
  const related = await getRelatedArticles(article.id)

  return <>
    <NewsJsonLd article={article} />
    <PageHero eyebrow={formatNewsDate(article.created_at)} title={article.title} description={article.excerpt || "Kabar terbaru dari Desa Kedungrejo."} image={article.image_url || "/images/dorr.jpg"} imagePosition="center 42%" />
    <ArticlePageContent article={article} related={related} />
  </>
}
