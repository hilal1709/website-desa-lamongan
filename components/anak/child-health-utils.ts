import type { ChildCheckFormValues, ChildDashboard, ChildFormValues } from "@/components/anak/child-health-types"

export const childHamlets = ["Dusun Dopok Sambi", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"]
export const childFeedingOptions = ["ASI eksklusif", "ASI + MPASI", "MPASI", "Makanan keluarga", "Lainnya"]
export const childDevelopmentOptions = ["Sesuai usia", "Perlu pemantauan", "Perlu rujukan"]
export const childInterventionOptions = ["BCG", "Polio", "DPT-HB-Hib", "Campak-Rubella", "PCV", "Rotavirus", "Vitamin A", "Obat cacing"]
export const childInputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
export const emptyChildDashboard: ChildDashboard = { metrics: { totalChildren: 0, checkedChildren: 0, attendanceRate: 0, sessionCount: 0 }, sessionAttendance: [], measurementTrend: [], developmentSummary: [], interventionSummary: [] }
export const createBlankChild = (): ChildFormValues => ({ fullName: "", gender: "", dusun: "", birthDate: "", address: "", guardianName: "", guardianPhone: "", isActive: true, publicProfileConsent: false })
export const createBlankChildCheck = (): ChildCheckFormValues => ({ weightKg: "", heightCm: "", headCircumferenceCm: "", feeding: "", interventions: [], developmentStatus: "", notes: "", referral: "" })
const dateFormatter = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" })
export const formatChildDate = (value: string) => dateFormatter.format(new Date(value))
export function childAgeMonths(value: string) { const birth = new Date(value); const today = new Date(); let months = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth(); if (today.getDate() < birth.getDate()) months--; return months }
