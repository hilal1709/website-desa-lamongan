import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { publishCmsUpdate } from "@/lib/pusher"

const limit = { name: 120, slug: 140, category: 80, description: 2000, logoUrl: 500, whatsapp: 32, address: 300, dusun: 100 }
const text = (value: unknown, field: keyof typeof limit) => typeof value === "string" ? value.trim().slice(0, limit[field]) : ""
const slugify = (value: string) => value.toLocaleLowerCase("id-ID").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

function profileInput(body: Record<string, unknown>) {
  const name = text(body.name, "name")
  const slug = slugify(text(body.slug, "slug") || name)
  const category = text(body.category, "category")
  const description = text(body.description, "description")
  const logoUrl = text(body.logoUrl, "logoUrl")
  const whatsapp = text(body.whatsapp, "whatsapp").replace(/\D/g, "")
  const address = text(body.address, "address")
  const dusun = text(body.dusun, "dusun")
  const registeredAt = typeof body.registeredAt === "string" ? new Date(`${body.registeredAt.slice(0, 10)}T00:00:00.000Z`) : new Date()
  if (!name || !slug || !category || !description || !logoUrl || !dusun || whatsapp.length < 9 || Number.isNaN(registeredAt.getTime())) return null
  return { name, slug, category, description, logoUrl, whatsapp, address: address || null, dusun, registeredAt, isPublished: body.isPublished !== false }
}

async function requireAdmin() {
  if (await getCurrentAdmin()) return true
  return false
}
const databaseError = () => NextResponse.json({ message: "Data UMKM belum dapat dimuat. Silakan coba lagi." }, { status: 500 })

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  try {
    const businesses = await prisma.umkm.findMany({ include: { products: { orderBy: { name: "asc" } } }, orderBy: { updatedAt: "desc" } })
    return NextResponse.json({ businesses })
  } catch { return databaseError() }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  const input = profileInput(await request.json() as Record<string, unknown>)
  if (!input) return NextResponse.json({ message: "Lengkapi profil UMKM, dusun, tanggal pencatatan, logo, dan nomor WhatsApp yang valid." }, { status: 400 })
  try {
    const business = await prisma.umkm.create({ data: input, include: { products: true } })
    revalidateTag("umkm", { expire: 0 })
    revalidateTag("admin-dashboard", "max")
    await publishCmsUpdate("umkm")
    return NextResponse.json({ business }, { status: 201 })
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") return NextResponse.json({ message: "Slug UMKM sudah digunakan." }, { status: 409 })
    return databaseError()
  }
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  const body = await request.json() as Record<string, unknown>
  const id = typeof body.id === "string" ? body.id : ""
  const input = profileInput(body)
  if (!id || !input) return NextResponse.json({ message: "Data UMKM tidak valid." }, { status: 400 })
  try {
    const business = await prisma.umkm.update({ where: { id }, data: input, include: { products: true } })
    revalidateTag("umkm", { expire: 0 })
    revalidateTag("admin-dashboard", "max")
    await publishCmsUpdate("umkm")
    return NextResponse.json({ business })
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") return NextResponse.json({ message: "Slug UMKM sudah digunakan." }, { status: 409 })
    if ((error as { code?: string }).code === "P2025") return NextResponse.json({ message: "UMKM tidak ditemukan." }, { status: 404 })
    return databaseError()
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  const id = new URL(request.url).searchParams.get("id")
  if (!id) return NextResponse.json({ message: "ID UMKM wajib diisi." }, { status: 400 })
  try {
    await prisma.umkm.delete({ where: { id } })
    revalidateTag("umkm", { expire: 0 })
    revalidateTag("admin-dashboard", "max")
    await publishCmsUpdate("umkm")
    return new NextResponse(null, { status: 204 })
  } catch { return databaseError() }
}
