import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { isServiceStatus, STATUS_LABEL } from "@/lib/village-services"
import { publishCmsUpdate } from "@/lib/pusher"

export async function PATCH(request: Request, context: RouteContext<"/api/cms/layanan/pengajuan/[id]">) {
  const user = await getCurrentAdmin(); if (!user) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  const { id } = await context.params, body = await request.json() as Record<string, unknown>
  const status = typeof body.status === "string" ? body.status : "", note = typeof body.note === "string" ? body.note.trim().slice(0, 1200) : ""
  if (!isServiceStatus(status)) return NextResponse.json({ message: "Status pengajuan tidak valid." }, { status: 400 })
  try {
    const submission = await prisma.serviceSubmission.update({ where: { id }, data: { status, history: { create: { status, note: note || null, updatedById: user.id } } }, include: { service: { select: { title: true } }, history: { orderBy: { createdAt: "desc" }, take: 1 } } })
    revalidateTag("admin-dashboard", "max")
    await publishCmsUpdate("services")
    return NextResponse.json({ submission: { ...submission, statusLabel: STATUS_LABEL[submission.status] } })
  } catch { return NextResponse.json({ message: "Pengajuan tidak ditemukan." }, { status: 404 }) }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/cms/layanan/pengajuan/[id]">) {
  const user = await getCurrentAdmin()
  if (!user) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  try {
    const { id } = await context.params
    await prisma.serviceSubmission.delete({ where: { id } })
    await publishCmsUpdate("services")
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") return NextResponse.json({ message: "Pengajuan tidak ditemukan." }, { status: 404 })
    return NextResponse.json({ message: "Pengajuan tidak dapat dihapus." }, { status: 500 })
  }
}
