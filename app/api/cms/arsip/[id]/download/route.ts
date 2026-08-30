import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { getArchiveDownload } from "@/lib/archive-storage"
import { audit } from "@/lib/audit-log"
import { clientAddress } from "@/lib/rate-limit"

export async function GET(request: Request, context: RouteContext<"/api/cms/arsip/[id]/download">) {
  const access = await requireCmsPermission("DOCUMENT_ARCHIVE"); if (access.response) return access.response
  const { id } = await context.params
  const document = await prisma.document.findUnique({ where: { id: Number(id) } }).catch(() => null)
  if (!document?.storagePath || !document.originalName) return new NextResponse("Berkas belum tersedia", { status: 404 })
  try {
    await audit("ARCHIVE_DOWNLOADED", "DOCUMENT", { actorId: access.user!.id, targetId: id, ip: clientAddress(request.headers) })
    const download = await getArchiveDownload(document.storagePath, document.originalName)
    if ("signedUrl" in download && download.signedUrl) return NextResponse.redirect(download.signedUrl)
    return new NextResponse(download.contents, { headers: { "Content-Type": document.mimeType ?? "application/octet-stream", "Content-Disposition": `attachment; filename="${document.originalName.replace(/[\r\n"]/g, "_")}"` } })
  } catch { return new NextResponse("Berkas belum dapat diakses", { status: 502 }) }
}
