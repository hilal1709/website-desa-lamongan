import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
}
const maxSize = 5 * 1024 * 1024

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("image")

  if (!(file instanceof File) || !allowedTypes[file.type]) {
    return NextResponse.json({ message: "Gunakan gambar JPG, PNG, WebP, atau GIF." }, { status: 400 })
  }
  if (file.size > maxSize) {
    return NextResponse.json({ message: "Ukuran gambar maksimal 5 MB." }, { status: 400 })
  }

  const filename = `${randomUUID()}${allowedTypes[file.type]}`
  const directory = path.join(process.cwd(), "public", "uploads", "cms")
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ url: `/uploads/cms/${filename}` })
}
