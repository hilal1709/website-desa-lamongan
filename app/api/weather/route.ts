import { NextRequest, NextResponse } from "next/server"

export const revalidate = 300

export async function GET(request: NextRequest) {
  const requestedPeriod = Number(request.nextUrl.searchParams.get("period"))
  const period = requestedPeriod === 14 ? 14 : 7
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=-7.1571&longitude=112.1593&current=temperature_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=Asia%2FJakarta&forecast_days=${period}`,
    { next: { revalidate: 300 } },
  )

  if (!response.ok) return NextResponse.json({ message: "Data cuaca tidak tersedia." }, { status: 502 })

  return NextResponse.json(await response.json(), {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  })
}
