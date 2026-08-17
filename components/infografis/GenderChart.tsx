"use client"

import { Doughnut } from "react-chartjs-2"
import { numberFormatter, tooltipLabel } from "./chartjs"

export function GenderChart({ male, female }: { male: number; female: number }) {
  const total = male + female
  return <div className="space-y-4"><div className="h-64"><Doughnut data={{ labels: ["Laki-laki", "Perempuan"], datasets: [{ label: "Jumlah", data: [male, female], backgroundColor: ["#1d4ed8", "#059669"], borderColor: "#fff", borderWidth: 3, spacing: 4 }] }} options={{ maintainAspectRatio: false, cutout: "60%", plugins: { legend: { display: false }, tooltip: { callbacks: { label: tooltipLabel } } } }} /></div><div className="grid grid-cols-2 gap-3 pt-2">{[["Laki-laki", male, "blue"], ["Perempuan", female, "emerald"]].map(([label, value, color]) => <div key={label as string} className={`flex items-center gap-3 rounded-2xl border p-3 ${color === "blue" ? "border-blue-100 bg-blue-50/70" : "border-emerald-100 bg-emerald-50/70"}`}><div className={`h-4 w-4 shrink-0 rounded-full ${color === "blue" ? "bg-blue-700" : "bg-emerald-600"}`} /><div><p className="text-xs font-bold text-slate-800">{label as string}</p><p className="text-sm font-black text-slate-950">{numberFormatter.format(value as number)} <span className="text-xs font-semibold text-slate-500">({total ? (((value as number) / total) * 100).toFixed(1) : "0"}%)</span></p></div></div>)}</div></div>
}
