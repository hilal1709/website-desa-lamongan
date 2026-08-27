import { revalidatePath, revalidateTag } from "next/cache"
import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { parseResidentInput, residentData } from "@/lib/residents"
import { publishCmsUpdate } from "@/lib/pusher"

function refreshed() { revalidateTag("home-data", "max"); revalidateTag("admin-dashboard", "max"); revalidatePath("/infografis"); revalidatePath("/admin"); void publishCmsUpdate("population") }

export async function GET(request: Request) {
  const access = await requireCmsPermission("INFOGRAPHICS"); if (access.response) return access.response
  const params = new URL(request.url).searchParams
  const query = params.get("q")?.trim() ?? ""
  const active = params.get("active") !== "false"
  try {
    const residents = await prisma.resident.findMany({ where: { isActive: active, ...(query ? { OR: [{ fullName: { contains: query, mode: "insensitive" } }, { nationalId: { contains: query } }, { familyCardNumber: { contains: query } }] } : {}) }, orderBy: { fullName: "asc" }, take: 200 })
    return Response.json({ residents })
  } catch {
    return Response.json({ message: "Basis data penduduk belum siap. Terapkan migrasi data penduduk terlebih dahulu." }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const access = await requireCmsPermission("INFOGRAPHICS", "create"); if (access.response) return access.response
  try { const resident = await prisma.resident.create({ data: residentData(parseResidentInput(await request.json())) }); refreshed(); return Response.json({ resident }, { status: 201 }) }
  catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Data penduduk tidak valid." }, { status: 400 }) }
}
