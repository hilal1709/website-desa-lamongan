import { NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { prisma } from "@/app/lib/prisma"
import { ensureDefaultVillageServices } from "@/lib/village-services"
import { publishCmsUpdate } from "@/lib/pusher"
import { requireCmsPermission } from "@/lib/api-access"

const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : ""
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
async function admin() { return !(await requireCmsPermission("SERVICE_CATALOG")).response }
function input(body: Record<string, unknown>) {
  const title = clean(body.title, 120), slug = slugify(clean(body.slug, 140) || title), description = clean(body.description, 1000), icon = clean(body.icon, 60) || "description", estimatedTime = clean(body.estimatedTime, 80) || "1-2 hari kerja"
  const requirements = Array.isArray(body.requirements) ? body.requirements.map((value) => clean(typeof value === "object" && value ? (value as { title?: unknown }).title : value, 180)).filter(Boolean) : []
  return title && slug && description ? { title, slug, description, icon, estimatedTime, isActive: body.isActive !== false, order: Number.isInteger(body.order) ? Math.max(0, Number(body.order)) : 0, requirements } : null
}
export async function GET() {
  if (!(await admin())) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })
  await ensureDefaultVillageServices()
  return NextResponse.json({ services: await prisma.villageService.findMany({ include: { requirements: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } }) })
}
export async function POST(request: Request) {
  const access = await requireCmsPermission("SERVICE_CATALOG", "create"); if (access.response) return access.response
  const data = input(await request.json() as Record<string, unknown>); if (!data) return NextResponse.json({ message: "Lengkapi judul dan deskripsi layanan." }, { status: 400 })
  try { const service = await prisma.villageService.create({ data: { ...data, requirements: { create: data.requirements.map((title, order) => ({ title, order })) } }, include: { requirements: true } }); revalidateTag("village-services", "max"); revalidateTag("home-data", "max"); revalidatePath("/layanan"); await publishCmsUpdate("pages"); return NextResponse.json({ service }, { status: 201 }) } catch { return NextResponse.json({ message: "Slug layanan sudah digunakan." }, { status: 409 }) }
}
export async function PUT(request: Request) {
  const access = await requireCmsPermission("SERVICE_CATALOG", "update"); if (access.response) return access.response
  const body = await request.json() as Record<string, unknown>, id = clean(body.id, 80), data = input(body); if (!id || !data) return NextResponse.json({ message: "Data layanan tidak valid." }, { status: 400 })
  try { const service = await prisma.villageService.update({ where: { id }, data: { ...data, requirements: { deleteMany: {}, create: data.requirements.map((title, order) => ({ title, order })) } }, include: { requirements: true } }); revalidateTag("village-services", "max"); revalidateTag("home-data", "max"); revalidatePath("/layanan"); await publishCmsUpdate("pages"); return NextResponse.json({ service }) } catch { return NextResponse.json({ message: "Layanan tidak dapat diperbarui." }, { status: 400 }) }
}
