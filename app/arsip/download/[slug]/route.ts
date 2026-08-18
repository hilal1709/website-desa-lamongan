import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

function escapePdf(value: string) {
  return value.replace(/[\\()]/g, "\\$&")
}

function createPdf(title: string, category: string) {
  const body = `BT /F1 20 Tf 72 760 Td (${escapePdf(title)}) Tj 0 -34 Td /F1 12 Tf (${escapePdf(category)} - Dokumen Publik) Tj 0 -40 Td (Pemerintah Desa Kedungrejo) Tj 0 -22 Td (Arsip digital untuk keterbukaan informasi publik.) Tj ET`
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>", `<< /Length ${body.length} >>\nstream\n${body}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"]
  let output = "%PDF-1.4\n"
  const offsets = [0]
  objects.forEach((object, index) => { offsets.push(output.length); output += `${index + 1} 0 obj\n${object}\nendobj\n` })
  const xref = output.length
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return output
}

export async function GET(_: Request, { params }: RouteContext<"/arsip/download/[slug]">) {
  const { slug } = await params
  const id = Number(slug)
  if (!Number.isInteger(id) || id < 1) return new NextResponse("Dokumen tidak ditemukan", { status: 404 })
  const document = await prisma.document.findUnique({ where: { id } }).catch(() => null)
  if (!document) return new NextResponse("Dokumen tidak ditemukan", { status: 404 })
  if (document.fileUrl && document.fileUrl !== "#") return NextResponse.redirect(new URL(document.fileUrl, _.url))
  const filename = `${document.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.pdf`
  return new NextResponse(createPdf(document.title, document.type), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${filename}"`, "Cache-Control": "no-store" } })
}
