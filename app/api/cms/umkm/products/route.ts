import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { publishCmsUpdate } from "@/lib/pusher"

const text = (value: unknown, length: number) => typeof value === "string" ? value.trim().slice(0, length) : ""

function productInput(body: Record<string, unknown>) {
  const name = text(body.name, 120)
  const description = text(body.description, 1200)
  const imageUrl = text(body.imageUrl, 500)
  const price = Number(body.price)
  if (!name || !description || !imageUrl || !Number.isSafeInteger(price) || price <= 0) return null
  return { name, description, imageUrl, price, isAvailable: body.isAvailable !== false }
}

async function authorized() { return Boolean(await getCurrentAdmin()) }
const databaseError = () => NextResponse.json({ message: "Data produk belum dapat diproses. Silakan coba lagi." }, { status: 500 })

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  const body = await request.json() as Record<string, unknown>
  const umkmId = typeof body.umkmId === "string" ? body.umkmId : ""
  const input = productInput(body)
  if (!umkmId || !input) return NextResponse.json({ message: "Lengkapi nama, deskripsi, gambar, dan harga produk." }, { status: 400 })
  try {
    const product = await prisma.umkmProduct.create({ data: { ...input, umkmId } })
    revalidateTag("umkm", { expire: 0 })
    await publishCmsUpdate("umkm")
    return NextResponse.json({ product }, { status: 201 })
  } catch { return databaseError() }
}

export async function PUT(request: Request) {
  if (!(await authorized())) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  const body = await request.json() as Record<string, unknown>
  const id = typeof body.id === "string" ? body.id : ""
  const input = productInput(body)
  if (!id || !input) return NextResponse.json({ message: "Data produk tidak valid." }, { status: 400 })
  try {
    const product = await prisma.umkmProduct.update({ where: { id }, data: input })
    revalidateTag("umkm", { expire: 0 })
    await publishCmsUpdate("umkm")
    return NextResponse.json({ product })
  } catch (error) {
    if ((error as { code?: string }).code === "P2025") return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 })
    return databaseError()
  }
}

export async function DELETE(request: Request) {
  if (!(await authorized())) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ message: "ID produk wajib diisi." }, { status: 400 })
  try {
    await prisma.umkmProduct.delete({ where: { id } })
    revalidateTag("umkm", { expire: 0 })
    await publishCmsUpdate("umkm")
    return new NextResponse(null, { status: 204 })
  } catch { return databaseError() }
}
