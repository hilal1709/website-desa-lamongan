import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { getArchiveDownload } from "@/lib/archive-storage"

export async function GET(request: Request, context: RouteContext<"/api/cms/arsip/[id]/download">) {
  if (!(await getCurrentAdmin())?.isSuperAdmin) return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 })
  const { id } = await context.params
  const document = await prisma.document.findUnique({ where: { id: Number(id) } }).catch(() => null)
  if (!document?.storagePath || !document.originalName) return new NextResponse("Berkas belum tersedia", { status: 404 })
  try {
    const download = await getArchiveDownload(document.storagePath, document.originalName)
    if ("signedUrl" in download && download.signedUrl) return NextResponse.redirect(download.signedUrl)
    return new NextResponse(download.contents, { headers: { "Content-Type": document.mimeType ?? "application/octet-stream", "Content-Disposition": `attachment; filename="${document.originalName.replace(/[\r\n"]/g, "_")}"` } })
  } catch { return new NextResponse("Berkas belum dapat diakses", { status: 502 }) }
}
