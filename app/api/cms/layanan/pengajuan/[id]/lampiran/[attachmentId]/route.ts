import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { readServiceAttachment } from "@/lib/service-attachments"

export async function GET(_request: Request, context: RouteContext<"/api/cms/layanan/pengajuan/[id]/lampiran/[attachmentId]">) {
  const { response } = await requireCmsPermission("SERVICE_SUBMISSIONS")
  if (response) return response
  const { id, attachmentId } = await context.params
  const attachment = await prisma.serviceAttachment.findFirst({ where: { id: attachmentId, submissionId: id } })
  if (!attachment) return NextResponse.json({ message: "Lampiran tidak ditemukan." }, { status: 404 })
  try {
    const file = await readServiceAttachment(attachment.storagePath)
    if ("signedUrl" in file) return NextResponse.redirect(file.signedUrl!)
    return new NextResponse(file.contents, { headers: { "Content-Type": attachment.mimeType, "Content-Disposition": `inline; filename="${attachment.filename.replace(/[^a-zA-Z0-9._-]/g, "_")}"`, "Cache-Control": "private, no-store" } })
  } catch { return NextResponse.json({ message: "Lampiran belum dapat diakses." }, { status: 404 }) }
}
