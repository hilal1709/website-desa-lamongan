import { dateFromInput, elderlyHamlets } from "@/lib/elderly-health"

type JsonRecord = Record<string, unknown>

export const childGenders = ["L", "P"] as const
export const feedingOptions = ["ASI eksklusif", "ASI + MPASI", "MPASI", "Makanan keluarga", "Lainnya"] as const
export const developmentOptions = ["Sesuai usia", "Perlu pemantauan", "Perlu rujukan"] as const
export const interventionOptions = ["BCG", "Polio", "DPT-HB-Hib", "Campak-Rubella", "PCV", "Rotavirus", "Vitamin A", "Obat cacing"] as const

function record(value: unknown): JsonRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Data tidak valid.")
  return value as JsonRecord
}

function requiredString(value: unknown, label: string, maxLength = 160) {
  if (typeof value !== "string") throw new Error(`${label} wajib diisi.`)
  const result = value.trim().replace(/\s+/g, " ")
  if (!result) throw new Error(`${label} wajib diisi.`)
  if (result.length > maxLength) throw new Error(`${label} terlalu panjang.`)
  return result
}

function optionalString(value: unknown, label: string, maxLength = 1000) {
  if (value === undefined || value === null || value === "") return null
  return requiredString(value, label, maxLength)
}

function positiveNumber(value: unknown, label: string, required = true) {
  if (!required && (value === undefined || value === null || value === "")) return null
  const number = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(number) || number <= 0) throw new Error(`${label} harus berupa angka positif.`)
  return number
}

function optionalChoice(value: unknown, label: string, options: readonly string[]) {
  if (value === undefined || value === null || value === "") return null
  if (typeof value !== "string" || !options.includes(value)) throw new Error(`${label} tidak valid.`)
  return value
}

export function ageInMonths(birthDate: Date, onDate = new Date()) {
  let months = (onDate.getUTCFullYear() - birthDate.getUTCFullYear()) * 12 + onDate.getUTCMonth() - birthDate.getUTCMonth()
  if (onDate.getUTCDate() < birthDate.getUTCDate()) months -= 1
  return months
}

export function validateChildInput(payload: unknown) {
  const data = record(payload)
  const birthDate = dateFromInput(data.birthDate, "Tanggal lahir")
  const months = ageInMonths(birthDate)
  if (months < 0 || months > 59) throw new Error("Anak harus berusia 0 sampai 59 bulan.")
  const dusun = requiredString(data.dusun, "Dusun")
  if (!elderlyHamlets.includes(dusun as (typeof elderlyHamlets)[number])) throw new Error("Dusun tidak valid.")
  if (typeof data.gender !== "string" || !childGenders.includes(data.gender as (typeof childGenders)[number])) throw new Error("Jenis kelamin tidak valid.")
  return { fullName: requiredString(data.fullName, "Nama lengkap"), gender: data.gender, dusun, birthDate, address: requiredString(data.address, "Alamat", 300), guardianName: requiredString(data.guardianName, "Nama wali"), guardianPhone: requiredString(data.guardianPhone, "Kontak wali", 40), publicProfileConsent: data.publicProfileConsent === true }
}

export function validateChildUpdate(payload: unknown) {
  const data = record(payload)
  return { ...validateChildInput(data), isActive: typeof data.isActive === "boolean" ? data.isActive : true }
}

export function validateChildCheckInput(payload: unknown) {
  const data = record(payload)
  const interventions = data.interventions === undefined ? [] : data.interventions
  if (!Array.isArray(interventions) || interventions.some((item) => typeof item !== "string" || !interventionOptions.includes(item as (typeof interventionOptions)[number]))) throw new Error("Tindakan KIA tidak valid.")
  return {
    sessionId: requiredString(data.sessionId, "Sesi"), childId: requiredString(data.childId, "Anak"),
    weightKg: positiveNumber(data.weightKg, "Berat badan") as number, heightCm: positiveNumber(data.heightCm, "Panjang/tinggi badan") as number, headCircumferenceCm: positiveNumber(data.headCircumferenceCm, "Lingkar kepala", false),
    feeding: optionalChoice(data.feeding, "Pola makan", feedingOptions), developmentStatus: optionalChoice(data.developmentStatus, "Status perkembangan", developmentOptions),
    interventions: [...new Set(interventions)] as string[], notes: optionalString(data.notes, "Catatan"), referral: optionalString(data.referral, "Rujukan"),
  }
}

export function validateChildSessionInput(payload: unknown) {
  const data = record(payload)
  return { name: requiredString(data.name, "Nama sesi"), sessionDate: dateFromInput(data.sessionDate, "Tanggal sesi") }
}

export function aggregateChildMeasurementTrend(checks: readonly { sessionDate: Date; weightKg: number; heightCm: number }[]) {
  const totals = new Map<string, { count: number; weightKg: number; heightCm: number }>()
  for (const check of checks) {
    const month = `${check.sessionDate.getUTCFullYear()}-${String(check.sessionDate.getUTCMonth() + 1).padStart(2, "0")}`
    const current = totals.get(month) ?? { count: 0, weightKg: 0, heightCm: 0 }
    current.count += 1; current.weightKg += check.weightKg; current.heightCm += check.heightCm; totals.set(month, current)
  }
  return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([month, total]) => ({ month, weightKg: total.weightKg / total.count, heightCm: total.heightCm / total.count }))
}
