import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

import { prisma } from "@/app/lib/prisma"
import { isComplaintCategory } from "@/lib/complaint-categories"
import { getComplaintsPage } from "@/lib/complaints"
import { COMPLAINT_PAGE_SIZE } from "@/lib/complaint-types"

const maxLengths = { title: 120, category: 80, location: 160, contact: 80, description: 2000 }

function readField(value: unknown, field: keyof typeof maxLengths) {
  return typeof value === "string" ? value.trim().slice(0, maxLengths[field]) : ""
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page"))
  const pageSize = Number(searchParams.get("pageSize"))
  return NextResponse.json(
    await getComplaintsPage(Number.isFinite(page) ? page : 1, Number.isFinite(pageSize) ? pageSize : COMPLAINT_PAGE_SIZE),
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  )
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>
  const title = readField(body.title, "title")
  const category = readField(body.category, "category")
  const location = readField(body.location, "location")
  const contact = readField(body.contact, "contact")
  const description = readField(body.description, "description")

  if (!title || !category || !location || !contact || !description) {
    return NextResponse.json({ message: "Mohon lengkapi semua kolom aduan." }, { status: 400 })
  }

  if (!isComplaintCategory(category)) {
    return NextResponse.json({ message: "Kategori aduan tidak valid." }, { status: 400 })
  }

  const complaint = await prisma.complaint.create({
    data: { title, category, location, contact, description },
    select: { id: true, title: true, category: true, location: true, status: true, publicResponse: true, respondedAt: true, createdAt: true },
  })

  revalidateTag("complaints", "max")
  revalidateTag("admin-dashboard", "max")

  return NextResponse.json({ complaint: { ...complaint, createdAt: complaint.createdAt.toISOString(), respondedAt: complaint.respondedAt?.toISOString() ?? null } }, { status: 201 })
}
