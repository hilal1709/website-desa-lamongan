import { PopulationEventType } from "@/generated/prisma/client"

export type PopulationFlowEvent = { eventDate: Date; type: PopulationEventType; dusun: string }
export type PopulationBalance = { dusun: string; effectiveDate: Date; totalPopulation: number }
export const populationAgeGroups = ["0–5", "6–17", "18–35", "36–59", "60+"] as const
export type PopulationAgeGroup = (typeof populationAgeGroups)[number]
export type PopulationGender = "Laki-laki" | "Perempuan"
export type PopulationDemographicCell = { ageGroup: PopulationAgeGroup; gender: PopulationGender; total: number }
export type PopulationDemographicBalance = PopulationBalance & { demographics: readonly PopulationDemographicCell[] }
export type PopulationDemographicEvent = PopulationFlowEvent & { gender: string; birthDate: Date }

function emptyCounts() {
  return {
    KELAHIRAN: 0,
    KEMATIAN: 0,
    PINDAH_MASUK: 0,
    PINDAH_KELUAR: 0,
  } satisfies Record<PopulationEventType, number>
}

export function summarizePopulationFlow(events: readonly PopulationFlowEvent[]) {
  const counts = emptyCounts()
  for (const event of events) counts[event.type] += 1
  const naturalChange = counts.KELAHIRAN - counts.KEMATIAN
  const netMigration = counts.PINDAH_MASUK - counts.PINDAH_KELUAR
  return { counts, naturalChange, netMigration, netChange: naturalChange + netMigration }
}

export function calculatePopulationByHamlet(balances: readonly PopulationBalance[], events: readonly PopulationFlowEvent[]) {
  const totals = new Map(balances.map((balance) => [balance.dusun, balance.totalPopulation]))
  const effectiveDates = new Map(balances.map((balance) => [balance.dusun, balance.effectiveDate.getTime()]))

  for (const event of events) {
    const effectiveDate = effectiveDates.get(event.dusun)
    if (effectiveDate === undefined || event.eventDate.getTime() < effectiveDate) continue
    const direction = event.type === PopulationEventType.KELAHIRAN || event.type === PopulationEventType.PINDAH_MASUK ? 1 : -1
    totals.set(event.dusun, (totals.get(event.dusun) ?? 0) + direction)
  }

  return [...totals.entries()]
    .map(([dusun, totalPopulation]) => ({ dusun, totalPopulation }))
    .sort((a, b) => a.dusun.localeCompare(b.dusun, "id"))
}

export function ageGroupOn(birthDate: Date, onDate: Date): PopulationAgeGroup {
  let age = onDate.getUTCFullYear() - birthDate.getUTCFullYear()
  const anniversaryPassed = onDate.getUTCMonth() > birthDate.getUTCMonth() || (onDate.getUTCMonth() === birthDate.getUTCMonth() && onDate.getUTCDate() >= birthDate.getUTCDate())
  if (!anniversaryPassed) age -= 1
  if (age <= 5) return "0–5"
  if (age <= 17) return "6–17"
  if (age <= 35) return "18–35"
  if (age <= 59) return "36–59"
  return "60+"
}

export function calculatePopulationDemographics(
  balances: readonly PopulationDemographicBalance[],
  events: readonly PopulationDemographicEvent[],
  asOfDate: Date,
) {
  const totals = new Map<string, number>()
  const effectiveDates = new Map(balances.map((balance) => [balance.dusun, balance.effectiveDate.getTime()]))
  const key = (ageGroup: PopulationAgeGroup, gender: PopulationGender) => `${ageGroup}:${gender}`

  for (const balance of balances) {
    for (const cell of balance.demographics) totals.set(key(cell.ageGroup, cell.gender), (totals.get(key(cell.ageGroup, cell.gender)) ?? 0) + cell.total)
  }
  for (const event of events) {
    const effectiveDate = effectiveDates.get(event.dusun)
    if (effectiveDate === undefined || event.eventDate.getTime() < effectiveDate || (event.gender !== "Laki-laki" && event.gender !== "Perempuan")) continue
    const cellKey = key(ageGroupOn(event.birthDate, asOfDate), event.gender)
    const direction = event.type === PopulationEventType.KELAHIRAN || event.type === PopulationEventType.PINDAH_MASUK ? 1 : -1
    totals.set(cellKey, Math.max(0, (totals.get(cellKey) ?? 0) + direction))
  }
  const rows = populationAgeGroups.map((ageGroup) => ({
    ageGroup,
    male: totals.get(key(ageGroup, "Laki-laki")) ?? 0,
    female: totals.get(key(ageGroup, "Perempuan")) ?? 0,
  }))
  return { rows, male: rows.reduce((sum, row) => sum + row.male, 0), female: rows.reduce((sum, row) => sum + row.female, 0) }
}
