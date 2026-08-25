import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { normalizeWhatsapp, STATUS_LABEL } from "@/lib/village-services"

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>
  const trackingCode = typeof body.trackingCode === "string" ? body.trackingCode.trim().toUpperCase().slice(0, 32) : ""
  const whatsapp = normalizeWhatsapp(typeof body.whatsapp === "string" ? body.whatsapp : "")
  if (!trackingCode || !whatsapp) return NextResponse.json({ message: "Masukkan kode pengajuan dan nomor WhatsApp." }, { status: 400 })
  const submission = await prisma.serviceSubmission.findFirst({ where: { trackingCode, whatsapp }, include: { service: { select: { title: true } }, history: { orderBy: { createdAt: "asc" }, select: { status: true, note: true, createdAt: true } } } })
  if (!submission) return NextResponse.json({ message: "Pengajuan tidak ditemukan. Periksa kembali kode dan nomor WhatsApp." }, { status: 404 })
  return NextResponse.json({ submission: { trackingCode: submission.trackingCode, service: submission.service.title, status: STATUS_LABEL[submission.status], createdAt: submission.createdAt.toISOString(), history: submission.history.map((item) => ({ status: STATUS_LABEL[item.status], note: item.note, createdAt: item.createdAt.toISOString() })) } })
}
