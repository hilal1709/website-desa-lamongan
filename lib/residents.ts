import { prisma } from "@/app/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export const residentEducationOptions = ["Tidak/Belum Sekolah", "SD/MI", "SMP/MTs", "SMA/SMK/MA", "Diploma", "S1", "S2/S3"] as const
export const residentOccupationOptions = ["Belum/Tidak Bekerja", "Petani", "Buruh", "Wiraswasta", "Karyawan", "PNS/TNI/Polri", "Pelajar/Mahasiswa", "Ibu Rumah Tangga", "Lainnya"] as const
export type ResidentInput = { nationalId: string; fullName: string; familyCardNumber: string; gender: string; birthDate: Date; dusun: string; education: string; occupation: string; isActive: boolean }

const required = (value: unknown, label: string) => { const text = typeof value === "string" ? value.trim() : ""; if (!text) throw new Error(`${label} wajib diisi.`); return text }
const birthDate = (value: unknown) => { const date = new Date(`${required(value, "Tanggal lahir")}T00:00:00.000Z`); if (Number.isNaN(date.getTime()) || date > new Date()) throw new Error("Tanggal lahir tidak valid."); return date }

export function parseResidentInput(value: unknown): ResidentInput {
  if (!value || typeof value !== "object") throw new Error("Data penduduk tidak valid.")
  const data = value as Record<string, unknown>
  const nationalId = required(data.nationalId, "NIK")
  const familyCardNumber = required(data.familyCardNumber, "Nomor KK")
  const gender = required(data.gender, "Jenis kelamin")
  const education = required(data.education, "Pendidikan")
  const occupation = required(data.occupation, "Pekerjaan")
  if (!/^\d{16}$/.test(nationalId)) throw new Error("NIK harus terdiri dari 16 digit.")
  if (!/^\d{16}$/.test(familyCardNumber)) throw new Error("Nomor KK harus terdiri dari 16 digit.")
  if (gender !== "Laki-laki" && gender !== "Perempuan") throw new Error("Jenis kelamin tidak valid.")
  if (!residentEducationOptions.includes(education as typeof residentEducationOptions[number])) throw new Error("Pendidikan tidak valid.")
  if (!residentOccupationOptions.includes(occupation as typeof residentOccupationOptions[number])) throw new Error("Pekerjaan tidak valid.")
  return { nationalId, familyCardNumber, gender, education, occupation, birthDate: birthDate(data.birthDate), fullName: required(data.fullName, "Nama lengkap"), dusun: required(data.dusun, "Dusun"), isActive: data.isActive !== false }
}

export function residentData(data: ResidentInput) { return data satisfies Prisma.ResidentUncheckedCreateInput }

function ageOn(date: Date) { const today = new Date(); let age = today.getUTCFullYear() - date.getUTCFullYear(); const month = today.getUTCMonth() - date.getUTCMonth(); if (month < 0 || (month === 0 && today.getUTCDate() < date.getUTCDate())) age--; return age }
function ageLabel(age: number) { if (age <= 5) return "0–5"; if (age <= 17) return "6–17"; if (age <= 35) return "18–35"; if (age <= 59) return "36–59"; return "60+" }

export async function getPublicResidentDashboard() {
  const active = { isActive: true }
  const [totalPopulation, households, genders, hamlets, educations, occupations, births] = await Promise.all([
    prisma.resident.count({ where: active }), prisma.resident.findMany({ where: active, distinct: ["familyCardNumber"], select: { id: true } }),
    prisma.resident.groupBy({ by: ["gender"], where: active, _count: { _all: true } }), prisma.resident.groupBy({ by: ["dusun"], where: active, _count: { _all: true }, orderBy: { dusun: "asc" } }),
    prisma.resident.groupBy({ by: ["education"], where: active, _count: { _all: true }, orderBy: { education: "asc" } }), prisma.resident.groupBy({ by: ["occupation"], where: active, _count: { _all: true }, orderBy: { occupation: "asc" } }),
    prisma.resident.findMany({ where: active, select: { birthDate: true } }),
  ])
  const ageGroups = ["0–5", "6–17", "18–35", "36–59", "60+"].map((label) => ({ label, total: births.filter((item) => ageLabel(ageOn(item.birthDate)) === label).length }))
  const gender = (label: string) => genders.find((item) => item.gender === label)?._count._all ?? 0
  return { totals: { population: totalPopulation, households: households.length, male: gender("Laki-laki"), female: gender("Perempuan") }, ageGroups, hamlets: hamlets.map((item) => ({ label: item.dusun, total: item._count._all })), educations: educations.map((item) => ({ label: item.education, total: item._count._all })), occupations: occupations.map((item) => ({ label: item.occupation, total: item._count._all })) }
}
