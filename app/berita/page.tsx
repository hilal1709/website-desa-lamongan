import { Newspaper } from "lucide-react"
import { FeaturedNewsCard } from "@/components/news/featured-news-card"
import { NewsCard } from "@/components/news/news-card"
import { PageHero } from "@/components/ui/page-hero"
import { supabase } from "@/lib/supabase/client"
import { getCmsPage } from "@/lib/cms-pages"
import type { NewsArticle } from "@/types"

export const metadata = { title: "Berita Desa | Kedungrejo", description: "Berita dan pengumuman terbaru dari Desa Kedungrejo." }
export const dynamic = "force-dynamic"

export default async function BeritaPage() {
  const hero = await getCmsPage("berita")

  if (!supabase) {
    return (
      <>
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          imagePosition={hero.imagePosition}
        />
        <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <EmptyNewsState />
        </section>
      </>
    )
  }

  const { data: featured } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const { data: news } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(1, 10)

  const featuredArticle = featured as NewsArticle | null
  const articles = (news ?? []) as NewsArticle[]

  return <>
    <PageHero eyebrow={hero.eyebrow} title={hero.title} description={hero.description} image={hero.image} imagePosition={hero.imagePosition} />
    <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">{featuredArticle ? <><div className="mb-5 flex items-center gap-2"><Newspaper size={19} className="text-emerald-800"/><h2 className="text-sm font-bold uppercase tracking-[.14em] text-slate-700">Berita utama</h2></div><FeaturedNewsCard article={featuredArticle}/><div className="my-12 flex items-center gap-4"><div className="h-px flex-1 bg-slate-200"/><h2 className="text-sm font-bold uppercase tracking-[.14em] text-slate-500">Berita terbaru</h2><div className="h-px flex-1 bg-slate-200"/></div></> : null}{articles.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <NewsCard key={article.id} article={article}/>)}</div> : !featuredArticle ? <EmptyNewsState/> : <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-600">Belum ada berita lainnya untuk ditampilkan.</p>}</section>
  </>
}

function EmptyNewsState() {
  return <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center"><span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-100 text-emerald-800"><Newspaper size={22}/></span><h2 className="mt-5 text-xl font-bold text-slate-900">Belum ada berita</h2><p className="mt-2 leading-6 text-slate-600">Berita terbaru dari Desa Kedungrejo akan segera hadir di halaman ini.</p></div>
}
