import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { getFreshCmsPages, saveCmsPages, type CmsPageContent } from "@/lib/cms-pages"
import { publishCmsUpdate } from "@/lib/pusher"
import { requireCmsPermission } from "@/lib/api-access"

export async function GET() {
  const { response } = await requireCmsPermission("PAGE_CONTENT"); if (response) return response
  return NextResponse.json({ pages: await getFreshCmsPages() })
}

export async function PUT(request: Request) {
  const { response } = await requireCmsPermission("PAGE_CONTENT", "update"); if (response) return response
  const body = (await request.json()) as { pages?: CmsPageContent[] }

  if (!Array.isArray(body.pages)) {
    return NextResponse.json({ message: "Format data halaman tidak valid." }, { status: 400 })
  }

  await saveCmsPages(body.pages)
  revalidateTag("cms-pages", { expire: 0 })
  revalidateTag("admin-dashboard", "max")
  // The public pages consume CMS content through route-level caches. Invalidate
  // the root layout so every affected public route is regenerated on its next visit.
  revalidatePath("/", "layout")
  await publishCmsUpdate("pages")
  return NextResponse.json({ pages: body.pages })
}
