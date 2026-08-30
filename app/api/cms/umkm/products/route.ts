import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { publishCmsUpdate } from "@/lib/pusher"

const text = (value: unknown, length: number) => typeof value === "string" ? value.trim().slice(0, length) : ""

function productInput(body: Record<string, unknown>) {
  const name = text(body.name, 120)
  const description = text(body.description, 1200)
  const imageUrl = text(body.imageUrl, 500)
  const price = Number(body.price)
  const variants = Array.isArray(body.variants) ? body.variants.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const value = item as Record<string, unknown>
    const variantName = text(value.name, 80).replace(/\s+/g, " ")
    const variantPrice = Number(value.price)
    return variantName && Number.isSafeInteger(variantPrice) && variantPrice > 0 ? [{ name: variantName, price: variantPrice }] : []
  }).slice(0, 30) : []
  if (!name || !description || !imageUrl || !Number.isSafeInteger(price) || price <= 0) return null
  return { name, description, imageUrl, price, variants, isAvailable: body.isAvailable !== false }
}

const databaseError = (error?: unknown) => {
  console.error("Gagal menyimpan produk UMKM:", error)
  const detail = process.env.NODE_ENV === "development" && error instanceof Error ? error.message : ""
  return NextResponse.json({ message: detail || "Data produk belum dapat diproses. Silakan coba lagi." }, { status: 500 })
}

export async function POST(request: Request) {
  const { response } = await requireCmsPermission("UMKM", "create"); if (response) return response
  const body = await request.json() as Record<string, unknown>
  const umkmId = typeof body.umkmId === "string" ? body.umkmId : ""
  const input = productInput(body)
  if (!umkmId || !input) return NextResponse.json({ message: "Lengkapi nama, deskripsi, gambar, dan harga produk." }, { status: 400 })
  try {
    const product = await prisma.umkmProduct.create({ data: { ...input, umkmId } })
    revalidateTag("umkm", { expire: 0 })
    await publishCmsUpdate("umkm")
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) { return databaseError(error) }
}

export async function PUT(request: Request) {
  const { response } = await requireCmsPermission("UMKM", "update"); if (response) return response
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
    return databaseError(error)
  }
}

export async function DELETE(request: Request) {
  const { response } = await requireCmsPermission("UMKM", "delete"); if (response) return response
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ message: "ID produk wajib diisi." }, { status: 400 })
  try {
    await prisma.umkmProduct.delete({ where: { id } })
    revalidateTag("umkm", { expire: 0 })
    await publishCmsUpdate("umkm")
    return new NextResponse(null, { status: 204 })
  } catch (error) { return databaseError(error) }
}
