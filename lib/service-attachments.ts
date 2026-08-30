import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"
import { scanForMalware } from "@/lib/malware-scan"

const allowedTypes: Record<string, string> = { "application/pdf": ".pdf", "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }
export const MAX_SERVICE_ATTACHMENT_SIZE = 5 * 1024 * 1024
const bucket = process.env.SUPABASE_SERVICE_ATTACHMENTS_BUCKET ?? "service-attachments"

async function readLocalServiceAttachment(storagePath: string) {
  const safePath = storagePath.split("/").map((part) => path.basename(part))
  return { contents: await fs.readFile(path.join(process.cwd(), "storage", "service-attachments", ...safePath)) }
}

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
}

export function validateAttachment(file: File) {
  if (!allowedTypes[file.type]) return "Berkas harus berupa PDF, JPG, PNG, atau WebP."
  if (file.size > MAX_SERVICE_ATTACHMENT_SIZE) return "Ukuran setiap berkas maksimal 5 MB."
  return null
}

export async function validateAttachmentContents(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const has = (...values: number[]) => values.every((value, index) => bytes[index] === value)
  const valid = file.type === "application/pdf" ? has(0x25, 0x50, 0x44, 0x46)
    : file.type === "image/jpeg" ? has(0xff, 0xd8, 0xff)
    : file.type === "image/png" ? has(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
    : file.type === "image/webp" ? has(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
    : false
  return valid ? null : "Isi berkas tidak sesuai dengan tipe yang diizinkan."
}

export async function storeServiceAttachment(file: File, submissionId: string) {
  const extension = allowedTypes[file.type]
  if (!extension) throw new Error("Jenis berkas tidak didukung.")
  const storagePath = `${submissionId}/${randomUUID()}${extension}`
  const contents = Buffer.from(await file.arrayBuffer())
  await scanForMalware(contents, file.name)
  const supabase = client()
  if (supabase) {
    const { error } = await supabase.storage.from(bucket).upload(storagePath, contents, { contentType: file.type, upsert: false })
    if (error) throw new Error("Berkas belum dapat disimpan.")
    return storagePath
  }
  if (process.env.NODE_ENV === "production") throw new Error("Penyimpanan berkas privat belum dikonfigurasi.")
  const directory = path.join(process.cwd(), "storage", "service-attachments", submissionId)
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(path.join(directory, path.basename(storagePath)), contents)
  return storagePath
}

export async function readServiceAttachment(storagePath: string) {
  const supabase = client()
  if (supabase) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storagePath, 60)
    if (!error && data.signedUrl) return { signedUrl: data.signedUrl }

    // Lampiran yang dibuat sebelum Supabase dikonfigurasi tersimpan secara lokal.
    // Pertahankan aksesnya selama berkas lokal tersebut masih tersedia.
    return readLocalServiceAttachment(storagePath)
  }
  return readLocalServiceAttachment(storagePath)
}
