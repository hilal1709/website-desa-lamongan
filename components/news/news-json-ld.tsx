import type { NewsArticle } from "@/types"

export function NewsJsonLd({ article }: { article: NewsArticle }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: article.title, description: article.excerpt || undefined, datePublished: article.created_at, dateModified: article.created_at, mainEntityOfPage: `/berita/${article.slug}`, image: article.image_url || undefined, author: { "@type": "Organization", name: "Pemerintah Desa Kedungrejo" }, publisher: { "@type": "Organization", name: "Pemerintah Desa Kedungrejo" } }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
