import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentAdmin } from "@/lib/admin-auth"

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
}
const maxSize = 5 * 1024 * 1024
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET ?? "cms-assets"

function storageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  return url && serviceRole ? createClient(url, serviceRole, { auth: { persistSession: false } }) : null
}

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  const formData = await request.formData()
  const file = formData.get("image")

  if (!(file instanceof File) || !allowedTypes[file.type]) {
    return NextResponse.json({ message: "Gunakan gambar JPG, PNG, WebP, atau GIF." }, { status: 400 })
  }
  if (file.size > maxSize) {
    return NextResponse.json({ message: "Ukuran gambar maksimal 5 MB." }, { status: 400 })
  }

  const filename = `${randomUUID()}${allowedTypes[file.type]}`
  const cloudStorage = storageClient()

  if (cloudStorage) {
    const objectPath = `cms/${filename}`
    const { error } = await cloudStorage.storage.from(storageBucket).upload(objectPath, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    })
    if (error) {
      console.error("CMS image upload failed", error)
      return NextResponse.json({ message: `Gambar gagal diunggah ke penyimpanan cloud: ${error.message}` }, { status: 502 })
    }
    const { data } = cloudStorage.storage.from(storageBucket).getPublicUrl(objectPath)
    return NextResponse.json({ url: data.publicUrl })
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Upload cloud belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di Vercel, lalu buat bucket publik 'cms-assets'." }, { status: 503 })
  }

  const directory = path.join(process.cwd(), "public", "uploads", "cms")
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ url: `/uploads/cms/${filename}` })
}
