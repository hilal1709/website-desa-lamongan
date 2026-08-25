import { getPublicResidentDashboard } from "@/lib/residents"

export const dynamic = "force-dynamic"

export async function GET() {
  try { return Response.json(await getPublicResidentDashboard(), { headers: { "Cache-Control": "no-store" } }) }
  catch { return Response.json({ error: "Data penduduk belum dapat dimuat." }, { status: 500 }) }
}
