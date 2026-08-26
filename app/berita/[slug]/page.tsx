import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ArticlePageContent } from "@/components/news/article-page-content"
import { formatNewsDate } from "@/components/news/news-card"
import { NewsJsonLd } from "@/components/news/news-json-ld"
import { PageHero } from "@/components/ui/page-hero"
import { getPublishedArticle, getRelatedArticles } from "@/lib/news-data"
import { createNewsArticleMetadata } from "@/lib/news-seo"

interface ArticlePageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) return { title: "Berita tidak ditemukan", robots: { index: false, follow: false } }

  return createNewsArticleMetadata(article)
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
