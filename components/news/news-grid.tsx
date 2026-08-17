import { NewsCard } from "@/components/news/news-card"
import { cn } from "@/lib/utils"
import type { NewsArticle } from "@/types"

interface NewsGridProps {
  articles: NewsArticle[]
  className?: string
}

export function NewsGrid({ articles, className }: NewsGridProps) {
  return (
    <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3", className)}>
      {articles.map((article) => (
        <li key={article.id}>
          <NewsCard article={article} />
        </li>
      ))}
    </ul>
  )
}
