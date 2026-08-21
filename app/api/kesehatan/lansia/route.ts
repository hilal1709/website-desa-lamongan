import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/app/lib/prisma"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { validateElderlyInput } from "@/lib/elderly-health"

export const dynamic = "force-dynamic"

function unauthorized() {
  return Response.json({ error: "Silakan masuk untuk mengakses data kesehatan." }, { status: 401 })
}

export async function GET(request: Request) {
  if (!(await getCurrentHealthUser())) return unauthorized()
  const params = new URL(request.url).searchParams
  const sessionId = params.get("sessionId")?.trim()
  const search = params.get("search")?.trim()
  const dusun = params.get("dusun")?.trim()
  const where: Prisma.ElderlyWhereInput = {
    ...(dusun ? { dusun } : {}),
    ...(search ? { fullName: { contains: search, mode: "insensitive" } } : {}),
  }
  const rows = await prisma.elderly.findMany({
    where,
    orderBy: [{ isActive: "desc" }, { fullName: "asc" }],
    include: {
      diseases: { orderBy: { startedAt: "desc" }, select: { id: true, diseaseName: true, normalizedName: true, startedAt: true, endedAt: true } },
      checks: sessionId ? { where: { sessionId }, select: { id: true, recordedAt: true, updatedAt: true, systolic: true, diastolic: true, weightKg: true, heightCm: true, bloodGlucoseMgDl: true, notes: true } } : false,
    },
  })
  const elderly = rows.map(({ diseases, checks, ...person }) => ({ ...person, checks: checks || [], diseases: diseases.filter((disease) => !disease.endedAt), diseaseHistory: diseases }))
  return Response.json({ elderly })
}

export async function POST(request: Request) {
  if (!(await getCurrentHealthUser())) return unauthorized()
  try {
    const data = validateElderlyInput(await request.json())
    const elderly = await prisma.elderly.create({
      data: {
        fullName: data.fullName,
        dusun: data.dusun,
        birthDate: data.birthDate,
        address: data.address,
        diseases: { create: data.diseases },
      },
      include: { diseases: true, checks: false },
    })
    return Response.json(elderly, { status: 201 })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Data lansia tidak valid." }, { status: 400 })
  }
}
