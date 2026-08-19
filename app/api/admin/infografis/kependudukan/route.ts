import { revalidatePath, revalidateTag } from "next/cache"

import { getCurrentAdmin } from "@/lib/admin-auth"
import { assertEventAfterOpeningBalance, validatePopulationEventInput } from "@/lib/population-events"
import { prisma } from "@/app/lib/prisma"
import { publishCmsUpdate } from "@/lib/pusher"

export const dynamic = "force-dynamic"

function refreshed() {
  revalidateTag("population-events", "max")
  revalidatePath("/infografis")
}

export async function GET() {
  if (!(await getCurrentAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const [events, balances] = await Promise.all([
    prisma.populationEvent.findMany({ orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }], take: 100 }),
    prisma.populationOpeningBalance.findMany({ orderBy: { dusun: "asc" } }),
  ])
  return Response.json({ events, balances })
}

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const data = validatePopulationEventInput(await request.json())
    await assertEventAfterOpeningBalance(data.dusun, data.eventDate)
    const event = await prisma.populationEvent.create({ data })
    refreshed()
    await publishCmsUpdate("population")
    return Response.json(event, { status: 201 })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Data peristiwa tidak valid." }, { status: 400 })
  }
}
