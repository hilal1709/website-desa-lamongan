import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getArchiveDownload } from "@/lib/archive-storage"

export async function GET(request: Request, { params }: RouteContext<"/arsip/download/[slug]">) {
  const { slug } = await params
  const id = Number(slug)
  if (!Number.isInteger(id) || id < 1) return new NextResponse("Dokumen tidak ditemukan", { status: 404 })
  const document = await prisma.document.findFirst({ where: { id, visibility: "PUBLIC" } }).catch(() => null)
  if (!document) return new NextResponse("Dokumen tidak ditemukan", { status: 404 })
  if (document.storagePath && document.originalName) {
    try {
      const download = await getArchiveDownload(document.storagePath, document.originalName)
      if ("signedUrl" in download && download.signedUrl) return NextResponse.redirect(download.signedUrl)
      return new NextResponse(download.contents, { headers: { "Content-Type": document.mimeType ?? "application/octet-stream", "Content-Disposition": `attachment; filename="${document.originalName.replace(/[\r\n"]/g, "_")}"` } })
    } catch { return new NextResponse("Berkas belum dapat diakses", { status: 502 }) }
  }
  if (document.fileUrl && document.fileUrl !== "#") return NextResponse.redirect(new URL(document.fileUrl, request.url))
  return new NextResponse("Berkas belum tersedia", { status: 404 })
}
