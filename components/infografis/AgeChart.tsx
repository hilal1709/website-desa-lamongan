"use client"

import { Bar } from "react-chartjs-2"
import { numberFormatter, tooltipLabel } from "./chartjs"

const colors = ["#0284c7", "#0d9488", "#059669", "#4f46e5", "#d97706"]

export function AgeChart({ data }: { data: { name: string; total: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.total, 0)
  return <div className="space-y-4"><div className="h-64"><Bar data={{ labels: data.map((item) => item.name), datasets: [{ label: "Penduduk", data: data.map((item) => item.total), backgroundColor: data.map((_, index) => colors[index % colors.length]), borderRadius: 10, borderSkipped: false }] }} options={{ indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: tooltipLabel } } }, scales: { x: { display: false, grid: { display: false } }, y: { grid: { display: false }, border: { display: false }, ticks: { color: "#334155", font: { size: 12, weight: 700 } } } } }} /></div><div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 sm:grid-cols-3">{data.map((item, index) => <div key={item.name} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5"><span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} /><div><p className="text-[11px] font-bold text-slate-700">Usia {item.name}</p><p className="text-xs font-black text-slate-900">{numberFormatter.format(item.total)} Jiwa <span className="font-semibold text-slate-500">({total ? ((item.total / total) * 100).toFixed(1) : "0"}%)</span></p></div></div>)}</div></div>
}
