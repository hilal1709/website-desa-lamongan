import { NextResponse } from "next/server"

import { getCurrentAdmin, hasAdminRole } from "@/lib/admin-auth"
import { getAdminComplaints } from "@/lib/admin-complaint-data"

export async function GET(request: Request) {
  const user = await getCurrentAdmin()
  if (!hasAdminRole(user)) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")?.trim()
  const category = searchParams.get("category")?.trim()
  const search = searchParams.get("search")?.trim()
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10)
  const requestedPageSize = Number.parseInt(searchParams.get("pageSize") ?? "12", 10)
  const data = await getAdminComplaints({ page: Number.isFinite(requestedPage) ? requestedPage : 1, pageSize: Number.isFinite(requestedPageSize) ? requestedPageSize : 12, status, category, search })
  return NextResponse.json(data, { headers: { "Cache-Control": "private, max-age=15, stale-while-revalidate=30" } })
}
