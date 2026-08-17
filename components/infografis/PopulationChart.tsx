"use client"

import { Bar } from "react-chartjs-2"
import { numberFormatter, tooltipLabel } from "./chartjs"

const colors = ["#059669", "#0d9488", "#2563eb", "#d97706", "#7c3aed"]

export function PopulationChart({ data }: { data: { dusun: string; total_population: number }[] }) {
  return <div className="space-y-4"><div className="h-56 sm:h-72"><Bar data={{ labels: data.map((item) => item.dusun.replace("Dusun ", "")), datasets: [{ label: "Penduduk", data: data.map((item) => item.total_population), backgroundColor: data.map((_, index) => colors[index % colors.length]), borderRadius: 12, borderSkipped: false }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: tooltipLabel } } }, scales: { x: { grid: { display: false }, ticks: { color: "#334155", font: { size: 10, weight: 700 }, maxRotation: 0, minRotation: 0 } }, y: { border: { display: false }, ticks: { color: "#64748b" }, grid: { color: "#e2e8f0" } } } }} /></div><div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2 lg:grid-cols-4">{data.map((item, index) => <div key={item.dusun} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5"><span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} /><div><p className="text-[11px] font-bold text-slate-700">{item.dusun}</p><p className="text-xs font-black text-slate-900">{numberFormatter.format(item.total_population)} Jiwa</p></div></div>)}</div></div>
}
