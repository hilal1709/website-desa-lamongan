import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { getFreshCmsPages, saveCmsPages, type CmsPageContent } from "@/lib/cms-pages"

export async function GET() {
  return NextResponse.json({ pages: await getFreshCmsPages() })
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { pages?: CmsPageContent[] }

  if (!Array.isArray(body.pages)) {
    return NextResponse.json({ message: "Format data halaman tidak valid." }, { status: 400 })
  }

  await saveCmsPages(body.pages)
  revalidateTag("cms-pages", "max")
  return NextResponse.json({ pages: body.pages })
}
