import { getPublicPopulationEventDashboard, parsePopulationFilters } from "@/lib/population-events"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const data = await getPublicPopulationEventDashboard(parsePopulationFilters(new URL(request.url).searchParams))
    return Response.json(data, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return Response.json({ error: "Data peristiwa kependudukan belum dapat dimuat." }, { status: 500 })
  }
}
