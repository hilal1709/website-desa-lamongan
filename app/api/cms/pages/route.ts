import { NextResponse } from "next/server"
import { getCmsPages, saveCmsPages, type CmsPageContent } from "@/lib/cms-pages"

export async function GET() {
  return NextResponse.json({ pages: await getCmsPages() })
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { pages?: CmsPageContent[] }

  if (!Array.isArray(body.pages)) {
    return NextResponse.json({ message: "Format data halaman tidak valid." }, { status: 400 })
  }

  await saveCmsPages(body.pages)
  return NextResponse.json({ pages: await getCmsPages() })
}
