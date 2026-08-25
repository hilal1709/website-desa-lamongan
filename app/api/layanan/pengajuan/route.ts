import { randomBytes } from "crypto"
import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { prisma } from "@/app/lib/prisma"
import { storeServiceAttachment, validateAttachment } from "@/lib/service-attachments"
import { normalizeWhatsapp } from "@/lib/village-services"

const text = (value: FormDataEntryValue | null, max: number) => typeof value === "string" ? value.trim().slice(0, max) : ""
const trackingCode = () => `KDR-${new Date().getFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`

export async function POST(request: Request) {
  const form = await request.formData()
  const serviceId = text(form.get("serviceId"), 80)
  const fullName = text(form.get("fullName"), 120)
  const nationalId = text(form.get("nationalId"), 32).replace(/\D/g, "")
  const address = text(form.get("address"), 500)
  const whatsapp = normalizeWhatsapp(text(form.get("whatsapp"), 32))
  const purpose = text(form.get("purpose"), 1200)
  if (!serviceId || !fullName || nationalId.length !== 16 || !address || whatsapp.length < 9 || !purpose) return NextResponse.json({ message: "Lengkapi data pengajuan dengan NIK dan nomor WhatsApp yang valid." }, { status: 400 })

  const service = await prisma.villageService.findFirst({ where: { id: serviceId, isActive: true }, include: { requirements: { where: { isRequired: true } } } })
  if (!service) return NextResponse.json({ message: "Layanan tidak tersedia atau sudah tidak aktif." }, { status: 404 })

  const files = form.getAll("attachments").filter((entry): entry is File => entry instanceof File && entry.size > 0)
  if (files.length < service.requirements.length) return NextResponse.json({ message: "Unggah semua berkas persyaratan yang wajib." }, { status: 400 })
  for (const file of files) { const error = validateAttachment(file); if (error) return NextResponse.json({ message: error }, { status: 400 }) }

  const submission = await prisma.serviceSubmission.create({ data: { trackingCode: trackingCode(), serviceId, fullName, nationalId, address, whatsapp, purpose, history: { create: { status: "DIAJUKAN", note: "Pengajuan diterima dan menunggu verifikasi petugas." } } } })
  try {
    const attachments = await Promise.all(files.map(async (file, index) => ({ filename: file.name.slice(0, 180), mimeType: file.type, size: file.size, storagePath: await storeServiceAttachment(file, submission.id), requirementId: service.requirements[index]?.id })))
    await prisma.serviceAttachment.createMany({ data: attachments.map((item) => ({ ...item, submissionId: submission.id })) })
  } catch (error) {
    await prisma.serviceSubmission.delete({ where: { id: submission.id } })
    return NextResponse.json({ message: error instanceof Error ? error.message : "Pengajuan belum dapat disimpan." }, { status: 503 })
  }
  revalidateTag("admin-dashboard", "max")
  return NextResponse.json({ trackingCode: submission.trackingCode, status: "Diajukan" }, { status: 201 })
}
