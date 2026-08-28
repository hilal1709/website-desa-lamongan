import { revalidatePath, revalidateTag } from "next/cache"

import { assertEventAfterOpeningBalance, validatePopulationEventInput } from "@/lib/population-events"
import { prisma } from "@/app/lib/prisma"
import { publishCmsUpdate } from "@/lib/pusher"
import { requireCmsPermission } from "@/lib/api-access"
import { PopulationEventType } from "@/generated/prisma/client"

export const dynamic = "force-dynamic"

function refreshed() {
  revalidateTag("home-data", "max")
  revalidateTag("admin-dashboard", "max")
  revalidateTag("population-events", { expire: 0 })
  revalidatePath("/infografis")
  revalidatePath("/admin")
}

export async function GET() {
  const access = await requireCmsPermission("INFOGRAPHICS"); if (access.response) return access.response
  const [events, balances] = await Promise.all([
    prisma.populationEvent.findMany({ orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }], take: 100 }),
    prisma.populationOpeningBalance.findMany({ orderBy: { dusun: "asc" } }),
  ])
  return Response.json({ events, balances }, { headers: { "Cache-Control": "private, max-age=20, stale-while-revalidate=40" } })
}

export async function POST(request: Request) {
  const access = await requireCmsPermission("INFOGRAPHICS", "create"); if (access.response) return access.response
  try {
    const data = validatePopulationEventInput(await request.json())
    await assertEventAfterOpeningBalance(data.dusun, data.eventDate)
    const resident = await prisma.$transaction(async (tx) => {
      const existing = await tx.resident.findUnique({ where: { nationalId: data.nationalId } })
      if (data.type === PopulationEventType.KELAHIRAN || data.type === PopulationEventType.PINDAH_MASUK) {
        return existing
          ? tx.resident.update({ where: { id: existing.id }, data: { fullName: data.fullName, familyCardNumber: data.familyCardNumber, gender: data.gender, birthDate: data.birthDate, dusun: data.dusun, isActive: true } })
          : tx.resident.create({ data: { nationalId: data.nationalId, fullName: data.fullName, familyCardNumber: data.familyCardNumber, gender: data.gender, birthDate: data.birthDate, dusun: data.dusun, education: "Tidak/Belum Sekolah", occupation: "Belum/Tidak Bekerja" } })
      }
      return existing ? tx.resident.update({ where: { id: existing.id }, data: { isActive: false } }) : null
    })
    const event = await prisma.populationEvent.create({ data: { ...data, residentId: resident?.id } })
    refreshed()
    await publishCmsUpdate("population")
    return Response.json(event, { status: 201 })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Data peristiwa tidak valid." }, { status: 400 })
  }
}
