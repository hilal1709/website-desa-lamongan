import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

const allowedTypes: Record<string, { extension: string; label: string }> = {
  "application/pdf": { extension: ".pdf", label: "PDF" },
  "application/msword": { extension: ".doc", label: "DOC" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { extension: ".docx", label: "DOCX" },
  "application/vnd.ms-excel": { extension: ".xls", label: "XLS" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { extension: ".xlsx", label: "XLSX" },
  "application/vnd.ms-powerpoint": { extension: ".ppt", label: "PPT" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { extension: ".pptx", label: "PPTX" },
}

export const MAX_ARCHIVE_FILE_SIZE = 20 * 1024 * 1024
export const archiveBucket = process.env.SUPABASE_ARCHIVE_BUCKET ?? "archive-documents"

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
}

export function validateArchiveFile(file: File) {
  if (!allowedTypes[file.type]) return "Berkas harus berupa PDF, DOC/DOCX, XLS/XLSX, atau PPT/PPTX."
  if (file.size > MAX_ARCHIVE_FILE_SIZE) return "Ukuran berkas maksimal 20 MB."
  return null
}

export function archiveType(file: File) {
  return allowedTypes[file.type]?.label ?? "Dokumen"
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export async function storeArchiveFile(file: File) {
  const definition = allowedTypes[file.type]
  if (!definition) throw new Error("Jenis berkas tidak didukung.")
  const storagePath = `archives/${randomUUID()}${definition.extension}`
  const contents = Buffer.from(await file.arrayBuffer())
  const supabase = client()
  if (supabase) {
    const { error } = await supabase.storage.from(archiveBucket).upload(storagePath, contents, { contentType: file.type, upsert: false })
    if (error) throw new Error("Berkas belum dapat disimpan.")
    return storagePath
  }
  if (process.env.NODE_ENV === "production") throw new Error("Penyimpanan arsip privat belum dikonfigurasi.")
  const directory = path.join(process.cwd(), "storage", "archive-documents", "archives")
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(path.join(directory, path.basename(storagePath)), contents)
  return storagePath
}

export async function getArchiveDownload(storagePath: string, originalName: string) {
  const supabase = client()
  if (supabase) {
    const { data, error } = await supabase.storage.from(archiveBucket).createSignedUrl(storagePath, 60, { download: originalName })
    if (error || !data.signedUrl) throw new Error("Berkas belum dapat diakses.")
    return { signedUrl: data.signedUrl }
  }
  const safePath = storagePath.split("/").map((part) => path.basename(part))
  return { contents: await fs.readFile(path.join(process.cwd(), "storage", "archive-documents", ...safePath)) }
}

export async function deleteArchiveFile(storagePath: string) {
  const supabase = client()
  if (supabase) {
    const { error } = await supabase.storage.from(archiveBucket).remove([storagePath])
    if (error) throw new Error("Berkas belum dapat dihapus.")
    return
  }
  const safePath = storagePath.split("/").map((part) => path.basename(part))
  await fs.rm(path.join(process.cwd(), "storage", "archive-documents", ...safePath), { force: true })
}
