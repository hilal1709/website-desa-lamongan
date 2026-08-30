import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { isComplaintStatus } from "@/lib/complaint-status"
import { publishCmsUpdate } from "@/lib/pusher"

function invalidateComplaints() {
  revalidateTag("complaints", "max")
  revalidateTag("admin-dashboard", "max")
}

export async function PATCH(request: Request, context: RouteContext<"/api/cms/aduan/[id]">) {
  const { response: accessResponse } = await requireCmsPermission("COMPLAINTS", "update"); if (accessResponse) return accessResponse

  const { id } = await context.params
  const body = await request.json() as Record<string, unknown>
  const status = typeof body.status === "string" ? body.status.trim() : ""
  const response = typeof body.response === "string" ? body.response.trim().slice(0, 2000) : ""
  if (!isComplaintStatus(status)) return NextResponse.json({ message: "Status aduan tidak valid." }, { status: 400 })

  try {
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status, publicResponse: response || null, respondedAt: response ? new Date() : null },
    })
    invalidateComplaints()
    await publishCmsUpdate("complaints")
    return NextResponse.json({ complaint: { ...complaint, createdAt: complaint.createdAt.toISOString(), updatedAt: complaint.updatedAt.toISOString(), respondedAt: complaint.respondedAt?.toISOString() ?? null } })
  } catch {
    return NextResponse.json({ message: "Aduan tidak ditemukan." }, { status: 404 })
  }
}

export async function DELETE(_: Request, context: RouteContext<"/api/cms/aduan/[id]">) {
  const { response: accessResponse } = await requireCmsPermission("COMPLAINTS", "delete"); if (accessResponse) return accessResponse
  const { id } = await context.params

  try {
    await prisma.complaint.delete({ where: { id } })
    invalidateComplaints()
    await publishCmsUpdate("complaints")
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: "Aduan tidak ditemukan." }, { status: 404 })
  }
}
