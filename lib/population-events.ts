import "server-only"

import { PopulationEventType, type Prisma } from "@/generated/prisma/client"
import { prisma } from "@/app/lib/prisma"
import { calculatePopulationByHamlet, calculatePopulationDemographics, populationAgeGroups, summarizePopulationFlow, type PopulationAgeGroup, type PopulationDemographicCell } from "@/lib/population-calculations"

export { calculatePopulationByHamlet, calculatePopulationDemographics, summarizePopulationFlow }

export const populationEventTypes = [
  PopulationEventType.KELAHIRAN,
  PopulationEventType.KEMATIAN,
  PopulationEventType.PINDAH_MASUK,
  PopulationEventType.PINDAH_KELUAR,
] as const

export const populationEventLabels: Record<PopulationEventType, string> = {
  KELAHIRAN: "Kelahiran",
  KEMATIAN: "Kematian",
  PINDAH_MASUK: "Pindah masuk",
  PINDAH_KELUAR: "Pindah keluar",
}

export type PopulationEventFilters = {
  year: number
  month: number | null
  dusun: string | null
  type: PopulationEventType | null
  page: number
  pageSize: number
}

export type PublicPopulationEvent = {
  id: string
  eventDate: string
  type: PopulationEventType
  typeLabel: string
  fullName: string
  gender: string
  birthYear: number
  dusun: string
}


export function parsePopulationFilters(params: URLSearchParams): PopulationEventFilters {
  const nowYear = new Date().getFullYear()
  const value = (key: string) => params.get(key)?.trim() ?? ""
  const parsedYear = Number(value("year"))
  const parsedMonth = Number(value("month"))
  const parsedPage = Number(value("page"))
  const parsedPageSize = Number(value("pageSize"))
  const typeValue = value("type")

  return {
    year: Number.isInteger(parsedYear) && parsedYear >= 2000 && parsedYear <= 2100 ? parsedYear : nowYear,
    month: Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12 ? parsedMonth : null,
    dusun: value("dusun") || null,
    type: populationEventTypes.includes(typeValue as PopulationEventType) ? (typeValue as PopulationEventType) : null,
    page: Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    pageSize: Number.isInteger(parsedPageSize) && parsedPage > 0 ? Math.min(parsedPageSize, 50) : 10,
  }
}

function rangeForFilter({ year, month }: Pick<PopulationEventFilters, "year" | "month">) {
  const start = month ? new Date(Date.UTC(year, month - 1, 1)) : new Date(Date.UTC(year, 0, 1))
  const end = month ? new Date(Date.UTC(year, month, 1)) : new Date(Date.UTC(year + 1, 0, 1))
  return { start, end, endInclusive: new Date(end.getTime() - 1) }
}

function whereForFilter(filters: PopulationEventFilters): Prisma.PopulationEventWhereInput {
  const range = rangeForFilter(filters)
  return {
    eventDate: { gte: range.start, lt: range.end },
    ...(filters.dusun ? { dusun: filters.dusun } : {}),
    ...(filters.type ? { type: filters.type } : {}),
  }
}

function emptyCounts() {
  return { KELAHIRAN: 0, KEMATIAN: 0, PINDAH_MASUK: 0, PINDAH_KELUAR: 0 } satisfies Record<PopulationEventType, number>
}

function demographicCells(value: Prisma.JsonValue | null): PopulationDemographicCell[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((cell) => {
    if (!cell || typeof cell !== "object" || Array.isArray(cell)) return []
    const item = cell as Record<string, unknown>
    if (!populationAgeGroups.includes(item.ageGroup as PopulationAgeGroup) || (item.gender !== "Laki-laki" && item.gender !== "Perempuan") || !Number.isInteger(item.total) || Number(item.total) < 0) return []
    return [{ ageGroup: item.ageGroup as PopulationAgeGroup, gender: item.gender, total: Number(item.total) }]
  })
}

function toPublicRecord(record: {
  id: string
  eventDate: Date
  type: PopulationEventType
  fullName: string
  gender: string
  birthDate: Date
  dusun: string
}): PublicPopulationEvent {
  return {
    id: record.id,
    eventDate: record.eventDate.toISOString().slice(0, 10),
    type: record.type,
    typeLabel: populationEventLabels[record.type],
    fullName: record.fullName,
    gender: record.gender,
    birthYear: record.birthDate.getUTCFullYear(),
    dusun: record.dusun,
  }
}

const publicSelect = {
  id: true,
  eventDate: true,
  type: true,
  fullName: true,
  gender: true,
  birthDate: true,
  dusun: true,
} satisfies Prisma.PopulationEventSelect

export async function getPublicPopulationEventDashboard(filters: PopulationEventFilters) {
  const where = whereForFilter(filters)
  const { endInclusive } = rangeForFilter(filters)
  const cumulativeWhere: Prisma.PopulationEventWhereInput = {
    eventDate: { lte: endInclusive },
    ...(filters.dusun ? { dusun: filters.dusun } : {}),
  }
  const balanceWhere: Prisma.PopulationOpeningBalanceWhereInput = {
    effectiveDate: { lte: endInclusive },
    ...(filters.dusun ? { dusun: filters.dusun } : {}),
  }

  const [records, totalRecords, rangeEvents, cumulativeEvents, balances] = await Promise.all([
    prisma.populationEvent.findMany({ where, select: publicSelect, orderBy: [{ eventDate: "desc" }, { fullName: "asc" }], skip: (filters.page - 1) * filters.pageSize, take: filters.pageSize }),
    prisma.populationEvent.count({ where }),
    prisma.populationEvent.findMany({ where, select: { eventDate: true, type: true, dusun: true } }),
    prisma.populationEvent.findMany({ where: cumulativeWhere, select: { eventDate: true, type: true, dusun: true, gender: true, birthDate: true } }),
    prisma.populationOpeningBalance.findMany({ where: balanceWhere, select: { dusun: true, effectiveDate: true, totalPopulation: true, demographics: true } }),
  ])

  const summary = summarizePopulationFlow(rangeEvents)
  const populationByHamlet = calculatePopulationByHamlet(balances, cumulativeEvents)
  const demographics = calculatePopulationDemographics(balances.map((balance) => ({ ...balance, demographics: demographicCells(balance.demographics) })), cumulativeEvents, endInclusive)
  const monthly = Array.from({ length: 12 }, (_, index) => ({ month: index + 1, ...emptyCounts() }))
  for (const event of rangeEvents) monthly[event.eventDate.getUTCMonth()][event.type] += 1
  const byHamlet = [...new Set(rangeEvents.map((event) => event.dusun))]
    .sort((a, b) => a.localeCompare(b, "id"))
    .map((dusun) => ({ dusun, ...summarizePopulationFlow(rangeEvents.filter((event) => event.dusun === dusun)).counts }))

  return {
    filters,
    summary: { ...summary, totalPopulation: populationByHamlet.reduce((sum, item) => sum + item.totalPopulation, 0), populationByHamlet, demographics },
    monthly,
    byHamlet,
    records: records.map(toPublicRecord),
    pagination: { page: filters.page, pageSize: filters.pageSize, totalRecords, totalPages: Math.max(1, Math.ceil(totalRecords / filters.pageSize)) },
  }
}

export async function getPublicPopulationEventExport(filters: PopulationEventFilters) {
  const records = await prisma.populationEvent.findMany({
    where: whereForFilter(filters),
    select: publicSelect,
    orderBy: [{ eventDate: "desc" }, { fullName: "asc" }],
  })
  return records.map(toPublicRecord)
}

function requiredString(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} wajib diisi.`)
  return value.trim()
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function dateValue(value: unknown, label: string) {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00.000Z`) : new Date("")
  if (Number.isNaN(date.getTime())) throw new Error(`${label} tidak valid.`)
  return date
}

export function validatePopulationEventInput(payload: unknown) {
  if (!payload || typeof payload !== "object") throw new Error("Data peristiwa tidak valid.")
  const data = payload as Record<string, unknown>
  const type = requiredString(data.type, "Jenis peristiwa") as PopulationEventType
  if (!populationEventTypes.includes(type)) throw new Error("Jenis peristiwa tidak valid.")
  const gender = requiredString(data.gender, "Jenis kelamin")
  if (!['Laki-laki', 'Perempuan'].includes(gender)) throw new Error("Jenis kelamin tidak valid.")

  const originAddress = optionalString(data.originAddress)
  const destinationAddress = optionalString(data.destinationAddress)
  if ((type === PopulationEventType.PINDAH_MASUK || type === PopulationEventType.PINDAH_KELUAR) && (!originAddress || !destinationAddress)) {
    throw new Error("Alamat asal dan alamat tujuan wajib diisi untuk data pindah.")
  }

  const eventDate = dateValue(data.eventDate, "Tanggal peristiwa")
  const birthDate = dateValue(data.birthDate, "Tanggal lahir")
  if (birthDate > eventDate) throw new Error("Tanggal lahir tidak boleh setelah tanggal peristiwa.")

  return {
    eventDate,
    type,
    dusun: requiredString(data.dusun, "Dusun"),
    fullName: requiredString(data.fullName, "Nama lengkap"),
    nationalId: requiredString(data.nationalId, "NIK"),
    familyCardNumber: requiredString(data.familyCardNumber, "Nomor KK"),
    gender,
    birthDate,
    residenceAddress: requiredString(data.residenceAddress, "Alamat domisili"),
    originAddress,
    destinationAddress,
    notes: optionalString(data.notes),
  } satisfies Prisma.PopulationEventUncheckedCreateInput
}

export async function assertEventAfterOpeningBalance(dusun: string, eventDate: Date, excludeId?: string) {
  const balance = await prisma.populationOpeningBalance.findUnique({ where: { dusun }, select: { effectiveDate: true } })
  if (!balance) throw new Error("Saldo awal dusun belum diatur.")
  if (eventDate < balance.effectiveDate) throw new Error("Tanggal peristiwa tidak boleh sebelum saldo awal dusun.")

  if (excludeId) {
    const existing = await prisma.populationEvent.findUnique({ where: { id: excludeId }, select: { id: true } })
    if (!existing) throw new Error("Catatan peristiwa tidak ditemukan.")
  }
}
