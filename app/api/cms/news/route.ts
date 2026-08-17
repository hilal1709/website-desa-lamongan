import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { getFreshCmsNews, saveCmsNews, type CmsNewsData } from "@/lib/news-cms"

export async function GET() { return NextResponse.json(await getFreshCmsNews()) }
export async function PUT(request: Request) {
  const data = await request.json() as CmsNewsData
  if (!Array.isArray(data.categories) || !Array.isArray(data.articles)) return NextResponse.json({ message: "Data berita tidak valid." }, { status: 400 })
  await saveCmsNews({ categories: data.categories.map((item) => item.trim()).filter(Boolean), articles: data.articles })
  revalidateTag("cms-news", "max")
  return NextResponse.json(data)
}
