import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { STATUS_LABEL } from "@/lib/village-services"

export async function GET(request: Request) {
  const { response } = await requireCmsPermission("SERVICE_SUBMISSIONS")
  if (response) return response
  const url = new URL(request.url), status = url.searchParams.get("status"), serviceId = url.searchParams.get("serviceId"), search = url.searchParams.get("search")?.trim()
  const submissions = await prisma.serviceSubmission.findMany({
    where: { ...(status ? { status: status as never } : {}), ...(serviceId ? { serviceId } : {}), ...(search ? { OR: [{ fullName: { contains: search, mode: "insensitive" } }, { trackingCode: { contains: search, mode: "insensitive" } }] } : {}) },
    include: { service: { select: { title: true } }, attachments: { select: { id: true, filename: true, requirementId: true } }, history: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { updatedAt: "desc" }, take: 100,
  })
  return NextResponse.json({ submissions: submissions.map(({ status: itemStatus, ...item }) => ({ ...item, status: itemStatus, statusLabel: STATUS_LABEL[itemStatus], createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), history: item.history.map((entry) => ({ ...entry, createdAt: entry.createdAt.toISOString(), statusLabel: STATUS_LABEL[entry.status] })) })) })
}
