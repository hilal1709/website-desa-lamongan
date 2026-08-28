import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { getCachedAdminArchiveDocuments } from "@/lib/admin-archive-data"
import { archiveType, deleteArchiveFile, formatFileSize, storeArchiveFile, validateArchiveFile } from "@/lib/archive-storage"
import { publishCmsUpdate } from "@/lib/pusher"

async function requireAdmin() {
  const user = await getCurrentAdmin()
  return user?.isSuperAdmin === true
}

function refreshPublicArchive() {
  revalidateTag("archive-documents", "max")
  revalidateTag("home-data", "max")
  revalidateTag("admin-dashboard", "max")
  revalidateTag("admin-archive-documents", "max")
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 })
  const documents = await getCachedAdminArchiveDocuments().catch(() => null)
  if (!documents) return NextResponse.json({ message: "Arsip belum dapat dimuat." }, { status: 500 })
  return NextResponse.json({ documents })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 })
  const formData = await request.formData()
  const file = formData.get("file")
  const title = typeof formData.get("title") === "string" ? String(formData.get("title")).trim().slice(0, 240) : ""
  const detail = typeof formData.get("detail") === "string" ? String(formData.get("detail")).trim().slice(0, 2000) : ""
  const visibility = formData.get("visibility") === "PRIVATE" ? "PRIVATE" : "PUBLIC"
  if (!(file instanceof File)) return NextResponse.json({ message: "Pilih berkas yang akan diunggah." }, { status: 400 })
  const validation = validateArchiveFile(file)
  if (validation) return NextResponse.json({ message: validation }, { status: 400 })
  if (!title) return NextResponse.json({ message: "Judul dokumen wajib diisi." }, { status: 400 })

  let storagePath = ""
  try {
    storagePath = await storeArchiveFile(file)
    const document = await prisma.document.create({ data: { title, detail: detail || null, type: archiveType(file), size: formatFileSize(file.size), icon: "description", visibility, originalName: file.name.slice(0, 255), mimeType: file.type, byteSize: file.size, storagePath } })
    refreshPublicArchive()
    if (visibility === "PUBLIC") await publishCmsUpdate("pages")
    return NextResponse.json({ document }, { status: 201 })
  } catch (error) {
    if (storagePath) await deleteArchiveFile(storagePath).catch(() => undefined)
    console.error("Archive upload failed", error)
    return NextResponse.json({ message: "Berkas belum dapat disimpan. Periksa konfigurasi penyimpanan arsip." }, { status: 500 })
  }
}
