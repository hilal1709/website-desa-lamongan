import { NextResponse } from "next/server"
import { revalidateTag, unstable_cache } from "next/cache"
import { prisma } from "@/app/lib/prisma"

const validTypes = new Set(["EVAKUASI", "RAWAN", "POSKO"])
const validOverrides = new Set(["auto", "aman", "waspada", "bahaya"])
const getCachedDisasterData = unstable_cache(
  async () => {
    const [setting, locations] = await Promise.all([
      prisma.disasterSetting.findUnique({ where: { id: 1 } }),
      prisma.disasterLocation.findMany({ where: { isActive: true }, orderBy: { updatedAt: "desc" } }),
    ])
    return { setting: setting ?? { override: "auto", announcement: null, updatedAt: null }, locations }
  },
  ["disaster-data"],
  { revalidate: 60, tags: ["disaster-data"] },
)

export async function GET() {
  return NextResponse.json(await getCachedDisasterData(), { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } })
}

export async function PUT(request: Request) {
  const body = await request.json() as {
    override?: string
    announcement?: string
    locations?: Array<{ id?: string; name: string; description?: string; type: string; latitude: number; longitude: number; isActive?: boolean }>
  }

  if (body.override && !validOverrides.has(body.override)) return NextResponse.json({ message: "Status tidak valid." }, { status: 400 })
  if (body.locations?.some((item) => !item.name.trim() || !validTypes.has(item.type) || !Number.isFinite(item.latitude) || !Number.isFinite(item.longitude))) {
    return NextResponse.json({ message: "Data titik peta tidak valid." }, { status: 400 })
  }

  const result = await prisma.$transaction(async (tx) => {
    const setting = await tx.disasterSetting.upsert({
      where: { id: 1 },
      update: { override: body.override ?? "auto", announcement: body.announcement?.trim() || null },
      create: { id: 1, override: body.override ?? "auto", announcement: body.announcement?.trim() || null },
    })

    if (body.locations) {
      await tx.disasterLocation.deleteMany()
      if (body.locations.length) {
        await tx.disasterLocation.createMany({
          data: body.locations.map((item) => ({
            name: item.name.trim(), description: item.description?.trim() || null, type: item.type as "EVAKUASI" | "RAWAN" | "POSKO",
            latitude: item.latitude, longitude: item.longitude, isActive: item.isActive ?? true,
          })),
        })
      }
    }

    return { setting, locations: await tx.disasterLocation.findMany({ where: { isActive: true }, orderBy: { updatedAt: "desc" } }) }
  })

  revalidateTag("disaster-data", "max")
  return NextResponse.json(result)
}
