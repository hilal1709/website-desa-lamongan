import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { deleteArchiveFile } from "@/lib/archive-storage"
import { publishCmsUpdate } from "@/lib/pusher"
import { audit } from "@/lib/audit-log"
import { clientAddress } from "@/lib/rate-limit"

function refresh() { revalidateTag("archive-documents", "max"); revalidateTag("home-data", "max"); revalidateTag("admin-dashboard", "max"); revalidateTag("admin-archive-documents", "max") }
async function documentId(context: RouteContext<"/api/cms/arsip/[id]">) { const { id } = await context.params; const value = Number(id); return Number.isInteger(value) && value > 0 ? value : null }

export async function PATCH(request: Request, context: RouteContext<"/api/cms/arsip/[id]">) {
  const access = await requireCmsPermission("DOCUMENT_ARCHIVE", "update"); if (access.response) return access.response
  const id = await documentId(context)
  const body = await request.json() as Record<string, unknown>
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 240) : ""
  const detail = typeof body.detail === "string" ? body.detail.trim().slice(0, 2000) : ""
  const visibility = body.visibility === "PRIVATE" ? "PRIVATE" : body.visibility === "PUBLIC" ? "PUBLIC" : null
  if (!id || !title || !visibility) return NextResponse.json({ message: "Data arsip tidak valid." }, { status: 400 })
  try {
    const previous = await prisma.document.findUnique({ where: { id } })
    if (!previous) return NextResponse.json({ message: "Dokumen tidak ditemukan." }, { status: 404 })
    const document = await prisma.document.update({ where: { id }, data: { title, detail: detail || null, visibility } })
    await audit("ARCHIVE_UPDATED", "DOCUMENT", { actorId: access.user!.id, targetId: String(id), ip: clientAddress(request.headers) })
    try {
      refresh()
      if (previous.visibility === "PUBLIC" || visibility === "PUBLIC") await publishCmsUpdate("pages")
    } catch (error) {
      console.error("Archive cache refresh failed after update", error)
    }
    return NextResponse.json({ document })
  } catch (error) {
    console.error("Archive update failed", error)
    return NextResponse.json({ message: "Arsip belum dapat diperbarui." }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: RouteContext<"/api/cms/arsip/[id]">) {
  const access = await requireCmsPermission("DOCUMENT_ARCHIVE", "delete"); if (access.response) return access.response
  const id = await documentId(context)
  if (!id) return NextResponse.json({ message: "ID dokumen tidak valid." }, { status: 400 })
  const document = await prisma.document.findUnique({ where: { id } }).catch(() => null)
  if (!document) return NextResponse.json({ message: "Dokumen tidak ditemukan." }, { status: 404 })
  try {
    if (document.storagePath) await deleteArchiveFile(document.storagePath)
    await prisma.document.delete({ where: { id } })
    await audit("ARCHIVE_DELETED", "DOCUMENT", { actorId: access.user!.id, targetId: String(id), ip: clientAddress(request.headers) })
    refresh()
    if (document.visibility === "PUBLIC") await publishCmsUpdate("pages")
    return new NextResponse(null, { status: 204 })
  } catch { return NextResponse.json({ message: "Arsip belum dapat dihapus." }, { status: 500 }) }
}
