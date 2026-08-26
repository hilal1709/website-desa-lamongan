import type { NewsArticle } from "@/types"
import { createNewsArticleJsonLd } from "@/lib/news-seo"

export function NewsJsonLd({ article }: { article: NewsArticle }) {
  const jsonLd = createNewsArticleJsonLd(article)
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
