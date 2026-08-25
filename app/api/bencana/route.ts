import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { prisma } from "@/app/lib/prisma"
import { publishCmsUpdate } from "@/lib/pusher"
import { requireCmsPermission } from "@/lib/api-access"

const validTypes = new Set(["EVAKUASI", "RAWAN", "POSKO"])
const validOverrides = new Set(["auto", "aman", "waspada", "bahaya"])
export async function GET(request: Request) {
  const includeInactive = new URL(request.url).searchParams.get("includeInactive") === "1"
  const [setting, locations] = await Promise.all([
    prisma.disasterSetting.findUnique({ where: { id: 1 } }),
    prisma.disasterLocation.findMany({ where: includeInactive ? undefined : { isActive: true }, orderBy: { updatedAt: "desc" } }),
  ])
  // The public components refetch this endpoint after a Pusher event. A CDN
  // stale-while-revalidate response would overwrite that fresh UI with the
  // previous status, so disaster data must never be served from an HTTP cache.
  return NextResponse.json(
    { setting: setting ?? { override: "auto", announcement: null, updatedAt: null }, locations },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  )
}

export async function PUT(request: Request) {
  const { response } = await requireCmsPermission("DISASTER_WEATHER", "update"); if (response) return response
  let body: {
    override?: string
    announcement?: string
    locations?: Array<{ id?: string; name: string; description?: string; type: string; latitude: number; longitude: number; isActive?: boolean }>
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: "Format data tidak valid." }, { status: 400 })
  }

  if (body.override && !validOverrides.has(body.override)) return NextResponse.json({ message: "Status tidak valid." }, { status: 400 })
  if (body.locations?.some((item) => !item.name.trim() || !validTypes.has(item.type) || !Number.isFinite(item.latitude) || !Number.isFinite(item.longitude) || item.latitude < -90 || item.latitude > 90 || item.longitude < -180 || item.longitude > 180)) {
    return NextResponse.json({ message: "Data titik peta tidak valid." }, { status: 400 })
  }

  try {
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

    revalidateTag("disaster-data", { expire: 0 })
    await publishCmsUpdate("disaster")
    return NextResponse.json(result)
  } catch (error) {
    console.error("Unable to save disaster settings", error)
    return NextResponse.json({ message: "Pengaturan bencana gagal disimpan. Coba lagi beberapa saat." }, { status: 500 })
  }
}
