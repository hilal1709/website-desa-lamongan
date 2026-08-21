export const elderlyHamlets = ["Dusun Dopok Sambi", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"] as const

type JsonRecord = Record<string, unknown>

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

function positiveNumber(value: unknown, label: string, integer = false) {
  const number = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(number) || number <= 0 || (integer && !Number.isInteger(number))) throw new Error(`${label} harus berupa angka positif.`)
  return number
}

export function dateFromInput(value: unknown, label: string) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`${label} tidak valid.`)
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) throw new Error(`${label} tidak valid.`)
  return date
}

export function ageOn(birthDate: Date, onDate = new Date()) {
  let age = onDate.getUTCFullYear() - birthDate.getUTCFullYear()
  const monthDifference = onDate.getUTCMonth() - birthDate.getUTCMonth()
  if (monthDifference < 0 || (monthDifference === 0 && onDate.getUTCDate() < birthDate.getUTCDate())) age -= 1
  return age
}

export function normalizeDiseaseName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID")
}

export function parseDiseases(value: unknown) {
  if (!Array.isArray(value)) throw new Error("Daftar penyakit tidak valid.")
  const known = new Set<string>()
  return value.flatMap((item) => {
    const diseaseName = requiredString(item, "Nama penyakit", 100)
    const normalizedName = normalizeDiseaseName(diseaseName)
    if (known.has(normalizedName)) return []
    known.add(normalizedName)
    return [{ diseaseName, normalizedName }]
  })
}

export function validateElderlyInput(payload: unknown) {
  const data = record(payload)
  const birthDate = dateFromInput(data.birthDate, "Tanggal lahir")
  if (ageOn(birthDate) < 60) throw new Error("Warga harus berusia minimal 60 tahun.")
  const dusun = requiredString(data.dusun, "Dusun")
  if (!elderlyHamlets.includes(dusun as (typeof elderlyHamlets)[number])) throw new Error("Dusun tidak valid.")
  return {
    fullName: requiredString(data.fullName, "Nama lengkap"),
    dusun,
    birthDate,
    address: requiredString(data.address, "Alamat", 300),
    diseases: parseDiseases(data.diseases ?? []),
  }
}

export function validateElderlyUpdate(payload: unknown) {
  const data = record(payload)
  return { ...validateElderlyInput(data), isActive: typeof data.isActive === "boolean" ? data.isActive : true }
}

export function validatePosyanduSessionInput(payload: unknown) {
  const data = record(payload)
  return { name: requiredString(data.name, "Nama sesi"), sessionDate: dateFromInput(data.sessionDate, "Tanggal sesi") }
}

export function validatePosyanduCheckInput(payload: unknown) {
  const data = record(payload)
  return {
    sessionId: requiredString(data.sessionId, "Sesi"),
    elderlyId: requiredString(data.elderlyId, "Lansia"),
    systolic: positiveNumber(data.systolic, "Tekanan sistolik", true),
    diastolic: positiveNumber(data.diastolic, "Tekanan diastolik", true),
    weightKg: positiveNumber(data.weightKg, "Berat badan"),
    heightCm: positiveNumber(data.heightCm, "Tinggi badan"),
    bloodGlucoseMgDl: positiveNumber(data.bloodGlucoseMgDl, "Gula darah"),
    notes: typeof data.notes === "string" && data.notes.trim() ? requiredString(data.notes, "Catatan", 1000) : null,
  }
}

export function parseHealthFilters(params: URLSearchParams) {
  const dusun = params.get("dusun")?.trim() || null
  const from = params.get("from") ? dateFromInput(params.get("from"), "Tanggal mulai") : null
  const to = params.get("to") ? dateFromInput(params.get("to"), "Tanggal akhir") : null
  if (dusun && !elderlyHamlets.includes(dusun as (typeof elderlyHamlets)[number])) throw new Error("Dusun tidak valid.")
  if (from && to && from > to) throw new Error("Rentang tanggal tidak valid.")
  return { dusun, from, to }
}

export type HealthCheckAggregate = { sessionDate: Date; systolic: number; diastolic: number; weightKg: number; heightCm: number; bloodGlucoseMgDl: number }

export function aggregateMeasurementTrend(checks: readonly HealthCheckAggregate[]) {
  const values = new Map<string, { count: number; systolic: number; diastolic: number; weightKg: number; heightCm: number; bloodGlucoseMgDl: number }>()
  for (const check of checks) {
    const key = `${check.sessionDate.getUTCFullYear()}-${String(check.sessionDate.getUTCMonth() + 1).padStart(2, "0")}`
    const current = values.get(key) ?? { count: 0, systolic: 0, diastolic: 0, weightKg: 0, heightCm: 0, bloodGlucoseMgDl: 0 }
    current.count += 1
    current.systolic += check.systolic
    current.diastolic += check.diastolic
    current.weightKg += check.weightKg
    current.heightCm += check.heightCm
    current.bloodGlucoseMgDl += check.bloodGlucoseMgDl
    values.set(key, current)
  }
  return [...values.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([month, value]) => ({
    month,
    systolic: value.systolic / value.count,
    diastolic: value.diastolic / value.count,
    weightKg: value.weightKg / value.count,
    heightCm: value.heightCm / value.count,
    bloodGlucoseMgDl: value.bloodGlucoseMgDl / value.count,
  }))
}
