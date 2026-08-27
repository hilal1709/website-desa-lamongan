import { getPublicPopulationEventDashboard, parsePopulationFilters } from "@/lib/population-events"
import { getPublicResidentProfile } from "@/lib/residents"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const [data, residentProfile] = await Promise.all([
      getPublicPopulationEventDashboard(parsePopulationFilters(new URL(request.url).searchParams)),
      getPublicResidentProfile(),
    ])
    return Response.json({ ...data, residentProfile }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return Response.json({ error: "Data peristiwa kependudukan belum dapat dimuat." }, { status: 500 })
  }
}
