import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

import { prisma } from "@/app/lib/prisma"
import { getRecentComplaints } from "@/lib/complaints"

const maxLengths = { title: 120, category: 80, location: 160, contact: 80, description: 2000 }

function readField(value: unknown, field: keyof typeof maxLengths) {
  return typeof value === "string" ? value.trim().slice(0, maxLengths[field]) : ""
}

export async function GET() {
  return NextResponse.json(
    { complaints: await getRecentComplaints() },
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

  const complaint = await prisma.complaint.create({
    data: { title, category, location, contact, description },
    select: { id: true, title: true, category: true, location: true, status: true, createdAt: true },
  })

  revalidateTag("complaints", "max")

  return NextResponse.json({ complaint: { ...complaint, createdAt: complaint.createdAt.toISOString() } }, { status: 201 })
}
