import { NextResponse } from "next/server"

import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin, hasAdminRole } from "@/lib/admin-auth"

export async function GET(request: Request) {
  const user = await getCurrentAdmin()
  if (!hasAdminRole(user)) return NextResponse.json({ message: "Silakan masuk sebagai admin." }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")?.trim()
  const category = searchParams.get("category")?.trim()
  const search = searchParams.get("search")?.trim()
  const complaints = await prisma.complaint.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
      ...(search ? { OR: [{ title: { contains: search, mode: "insensitive" } }, { location: { contains: search, mode: "insensitive" } }, { contact: { contains: search, mode: "insensitive" } }] } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  })

  return NextResponse.json({ complaints: complaints.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), respondedAt: item.respondedAt?.toISOString() ?? null })) })
}
