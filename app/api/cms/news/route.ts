import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { getFreshCmsNews, saveCmsNews, type CmsNewsData } from "@/lib/news-cms"
import { publishCmsUpdate } from "@/lib/pusher"

export async function GET() { return NextResponse.json(await getFreshCmsNews()) }
export async function PUT(request: Request) {
  const data = await request.json() as CmsNewsData
  if (!Array.isArray(data.categories) || !Array.isArray(data.articles)) return NextResponse.json({ message: "Data berita tidak valid." }, { status: 400 })
  await saveCmsNews({ categories: data.categories.map((item) => item.trim()).filter(Boolean), articles: data.articles })
  revalidateTag("cms-news", { expire: 0 })
  revalidateTag("admin-dashboard", "max")
  revalidatePath("/berita")
  data.articles.filter((article) => article.slug).forEach((article) => revalidatePath(`/berita/${article.slug}`))
  await publishCmsUpdate("news")
  return NextResponse.json(data)
}
