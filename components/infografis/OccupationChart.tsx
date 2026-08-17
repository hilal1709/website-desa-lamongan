"use client"

import { Bar, Doughnut } from "react-chartjs-2"
import { tooltipLabel } from "./chartjs"

const colors = ["#059669", "#d97706", "#2563eb", "#4f46e5", "#7c3aed", "#0f766e", "#0284c7", "#64748b"]

export function OccupationChart({ data }: { data: { name: string; total: number }[] }) {
  const top = [...data].sort((a, b) => b.total - a.total).slice(0, 5)
  return <div className="grid gap-6 lg:grid-cols-2"><div className="space-y-3"><h4 className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-left">Distribusi Sektor Pekerjaan</h4><div className="h-72"><Doughnut data={{ labels: data.map((item) => item.name), datasets: [{ label: "Jumlah Pekerja", data: data.map((item) => item.total), backgroundColor: data.map((_, index) => colors[index % colors.length]), borderColor: "#fff", borderWidth: 2, spacing: 3 }] }} options={{ maintainAspectRatio: false, cutout: "50%", plugins: { legend: { position: "bottom", labels: { boxWidth: 9, usePointStyle: true, padding: 12 } }, tooltip: { callbacks: { label: tooltipLabel } } } }} /></div></div><div className="space-y-3"><h4 className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 sm:text-left">5 Pekerjaan Terbanyak Warga</h4><div className="h-72"><Bar data={{ labels: top.map((item) => item.name), datasets: [{ label: "Jumlah Pekerja", data: top.map((item) => item.total), backgroundColor: top.map((_, index) => colors[index % colors.length]), borderRadius: 8, borderSkipped: false }] }} options={{ indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: tooltipLabel } } }, scales: { x: { display: false, grid: { display: false } }, y: { border: { display: false }, grid: { display: false }, ticks: { color: "#334155", font: { size: 11, weight: 700 } } } } }} /></div></div></div>
}
