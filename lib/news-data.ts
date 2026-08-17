import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase/client"
import type { NewsArticle } from "@/types"

export interface NewsPageData {
  featured: NewsArticle | null
  articles: NewsArticle[]
  count: number
}

export const getNewsPageData = unstable_cache(
  async (): Promise<NewsPageData> => {
    if (!supabase) return { featured: null, articles: [], count: 0 }

    try {
      const [{ data: featured }, { data: articles }, { count }] = await Promise.all([
        supabase.from("news").select("*").eq("published", true).order("created_at", { ascending: false }).limit(1).single(),
        supabase.from("news").select("*").eq("published", true).order("created_at", { ascending: false }).range(1, 10),
        supabase.from("news").select("id", { count: "exact", head: true }).eq("published", true),
      ])

      return {
        featured: featured as NewsArticle | null,
        articles: (articles ?? []) as NewsArticle[],
        count: count ?? 0,
      }
    } catch {
      return { featured: null, articles: [], count: 0 }
    }
  },
  ["news-page-data"],
  { revalidate: 300, tags: ["news"] },
)
