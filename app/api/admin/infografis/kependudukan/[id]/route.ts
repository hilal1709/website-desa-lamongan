import { revalidatePath, revalidateTag } from "next/cache"

import { requireCmsPermission } from "@/lib/api-access"
import { assertEventAfterOpeningBalance, validatePopulationEventInput } from "@/lib/population-events"
import { prisma } from "@/app/lib/prisma"
import { publishCmsUpdate } from "@/lib/pusher"

export const dynamic = "force-dynamic"

function refreshed() {
  revalidateTag("home-data", "max")
  revalidateTag("admin-dashboard", "max")
  revalidateTag("population-events", { expire: 0 })
  revalidatePath("/infografis")
  revalidatePath("/admin")
}

export async function PATCH(request: Request, context: RouteContext<"/api/admin/infografis/kependudukan/[id]">) {
  const access = await requireCmsPermission("INFOGRAPHICS", "update"); if (access.response) return access.response
  try {
    const { id } = await context.params
    const data = validatePopulationEventInput(await request.json())
    await assertEventAfterOpeningBalance(data.dusun, data.eventDate, id)
    const event = await prisma.populationEvent.update({ where: { id }, data })
    refreshed()
    await publishCmsUpdate("population")
    return Response.json(event)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Data peristiwa tidak valid." }, { status: 400 })
  }
}

export async function DELETE(_: Request, context: RouteContext<"/api/admin/infografis/kependudukan/[id]">) {
  const access = await requireCmsPermission("INFOGRAPHICS", "delete"); if (access.response) return access.response
  try {
    const { id } = await context.params
    await prisma.populationEvent.delete({ where: { id } })
    refreshed()
    await publishCmsUpdate("population")
    return new Response(null, { status: 204 })
  } catch {
    return Response.json({ error: "Catatan peristiwa tidak ditemukan." }, { status: 404 })
  }
}
