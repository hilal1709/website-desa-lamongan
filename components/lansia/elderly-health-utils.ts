export const hamlets = ["Dusun Dopok Sambi", "Dusun Gabang", "Dusun Karangpilang", "Dusun Topang"] as const
export const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"

export function dateLabel(value: string) { return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(value)) }
export function age(value: string) { const birth = new Date(value); const today = new Date(); let years = today.getFullYear() - birth.getFullYear(); if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) years -= 1; return years }
export function metricLabel(metric: string) { return ({ systolic: "Sistolik", diastolic: "Diastolik", weightKg: "Berat badan (kg)", heightCm: "Tinggi badan (cm)", bloodGlucoseMgDl: "Gula darah (mg/dL)" } as Record<string, string>)[metric] }
