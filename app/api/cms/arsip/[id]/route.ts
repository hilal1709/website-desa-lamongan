import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { deleteArchiveFile } from "@/lib/archive-storage"
import { publishCmsUpdate } from "@/lib/pusher"

async function requireAdmin() { return (await getCurrentAdmin())?.isSuperAdmin === true }
function refresh() { revalidateTag("archive-documents", "max"); revalidateTag("home-data", "max"); revalidateTag("admin-dashboard", "max") }
async function documentId(context: RouteContext<"/api/cms/arsip/[id]">) { const { id } = await context.params; const value = Number(id); return Number.isInteger(value) && value > 0 ? value : null }

export async function PATCH(request: Request, context: RouteContext<"/api/cms/arsip/[id]">) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 })
  const id = await documentId(context)
  const body = await request.json() as Record<string, unknown>
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 240) : ""
  const visibility = body.visibility === "PRIVATE" ? "PRIVATE" : body.visibility === "PUBLIC" ? "PUBLIC" : null
  if (!id || !title || !visibility) return NextResponse.json({ message: "Data arsip tidak valid." }, { status: 400 })
  try {
    const previous = await prisma.document.findUnique({ where: { id } })
    if (!previous) return NextResponse.json({ message: "Dokumen tidak ditemukan." }, { status: 404 })
    const document = await prisma.document.update({ where: { id }, data: { title, visibility } })
    refresh()
    if (previous.visibility === "PUBLIC" || visibility === "PUBLIC") await publishCmsUpdate("pages")
    return NextResponse.json({ document })
  } catch { return NextResponse.json({ message: "Arsip belum dapat diperbarui." }, { status: 500 }) }
}

export async function DELETE(_: Request, context: RouteContext<"/api/cms/arsip/[id]">) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 })
  const id = await documentId(context)
  if (!id) return NextResponse.json({ message: "ID dokumen tidak valid." }, { status: 400 })
  const document = await prisma.document.findUnique({ where: { id } }).catch(() => null)
  if (!document) return NextResponse.json({ message: "Dokumen tidak ditemukan." }, { status: 404 })
  try {
    if (document.storagePath) await deleteArchiveFile(document.storagePath)
    await prisma.document.delete({ where: { id } })
    refresh()
    if (document.visibility === "PUBLIC") await publishCmsUpdate("pages")
    return new NextResponse(null, { status: 204 })
  } catch { return NextResponse.json({ message: "Arsip belum dapat dihapus." }, { status: 500 }) }
}
