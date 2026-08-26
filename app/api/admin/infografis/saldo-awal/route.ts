import { revalidatePath, revalidateTag } from "next/cache"

import { getCurrentAdmin } from "@/lib/admin-auth"
import { prisma } from "@/app/lib/prisma"
import { populationAgeGroups, type PopulationAgeGroup, type PopulationDemographicCell } from "@/lib/population-calculations"
import { publishCmsUpdate } from "@/lib/pusher"

export const dynamic = "force-dynamic"

function dateValue(value: unknown) {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00.000Z`) : new Date("")
  if (Number.isNaN(date.getTime())) throw new Error("Tanggal data dasar tidak valid.")
  return date
}

function demographicsValue(value: unknown, totalPopulation: number) {
  if (!Array.isArray(value)) throw new Error("Komposisi jenis kelamin dan usia wajib diisi.")
  const cells = value.map((cell) => {
    const item = cell as Record<string, unknown>
    const total = Number(item.total)
    if (!populationAgeGroups.includes(item.ageGroup as PopulationAgeGroup) || (item.gender !== "Laki-laki" && item.gender !== "Perempuan") || !Number.isInteger(total) || total < 0) throw new Error("Komposisi penduduk tidak valid.")
    return { ageGroup: item.ageGroup as PopulationAgeGroup, gender: item.gender, total } satisfies PopulationDemographicCell
  })
  const expected = new Set(populationAgeGroups.flatMap((ageGroup) => ["Laki-laki", "Perempuan"].map((gender) => `${ageGroup}:${gender}`)))
  if (cells.length !== expected.size || new Set(cells.map((cell) => `${cell.ageGroup}:${cell.gender}`)).size !== expected.size) throw new Error("Lengkapi semua kelompok usia untuk laki-laki dan perempuan.")
  if (cells.reduce((sum, cell) => sum + cell.total, 0) !== totalPopulation) throw new Error("Total komposisi usia dan jenis kelamin harus sama dengan jumlah jiwa.")
  return cells
}

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await request.json() as Record<string, unknown>
    const dusun = typeof body.dusun === "string" ? body.dusun.trim() : ""
    const totalPopulation = Number(body.totalPopulation)
    const effectiveDate = dateValue(body.effectiveDate)
    if (!dusun || !Number.isInteger(totalPopulation) || totalPopulation < 0) throw new Error("Dusun dan jumlah penduduk wajib diisi.")
    const demographics = demographicsValue(body.demographics, totalPopulation)

    const earliestEvent = await prisma.populationEvent.findFirst({ where: { dusun }, orderBy: { eventDate: "asc" }, select: { eventDate: true } })
    if (earliestEvent && earliestEvent.eventDate < effectiveDate) throw new Error("Tanggal data dasar tidak boleh setelah catatan peristiwa yang sudah ada.")

    const balance = await prisma.populationOpeningBalance.upsert({ where: { dusun }, update: { effectiveDate, totalPopulation, demographics }, create: { dusun, effectiveDate, totalPopulation, demographics } })
    revalidateTag("population-events", { expire: 0 })
    revalidatePath("/infografis")
    await publishCmsUpdate("population")
    return Response.json(balance)
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Data dasar tidak valid." }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  if (!(await getCurrentAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const id = new URL(request.url).searchParams.get("id")?.trim()
    if (!id) throw new Error("Data dasar tidak ditemukan.")
    const balance = await prisma.populationOpeningBalance.findUnique({ where: { id }, select: { id: true, dusun: true } })
    if (!balance) throw new Error("Data dasar tidak ditemukan.")
    const eventCount = await prisma.populationEvent.count({ where: { dusun: balance.dusun } })
    if (eventCount > 0) throw new Error("Data dasar tidak dapat dihapus karena dusun ini masih memiliki catatan peristiwa. Hapus catatan peristiwa terlebih dahulu.")

    await prisma.populationOpeningBalance.delete({ where: { id: balance.id } })
    revalidateTag("population-events", { expire: 0 })
    revalidatePath("/infografis")
    await publishCmsUpdate("population")
    return new Response(null, { status: 204 })
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Data dasar tidak dapat dihapus." }, { status: 400 })
  }
}
