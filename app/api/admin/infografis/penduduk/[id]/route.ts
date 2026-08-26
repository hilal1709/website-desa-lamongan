import { revalidatePath, revalidateTag } from "next/cache"
import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { parseResidentInput, residentData } from "@/lib/residents"
import { publishCmsUpdate } from "@/lib/pusher"

function refreshed() { revalidateTag("home-data", "max"); revalidatePath("/infografis"); void publishCmsUpdate("population") }

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const access = await requireCmsPermission("INFOGRAPHICS", "update"); if (access.response) return access.response
  try { const { id } = await context.params; const resident = await prisma.resident.update({ where: { id }, data: residentData(parseResidentInput(await request.json())) }); refreshed(); return Response.json({ resident }) }
  catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Data penduduk tidak dapat diperbarui." }, { status: 400 }) }
}
