"use client"

import { Line } from "react-chartjs-2"
import { tooltipLabel } from "./chartjs"

export function TrendChart({ data }: { data: { year: number; total_population: number }[] }) {
  return <div className="h-56 sm:h-72"><Line data={{ labels: data.map((item) => item.year), datasets: [{ label: "Jumlah Penduduk", data: data.map((item) => item.total_population), borderColor: "#059669", backgroundColor: "rgba(5, 150, 105, .16)", fill: true, tension: .35, pointRadius: 4, pointHoverRadius: 7, pointBackgroundColor: "#059669", pointBorderColor: "#fff", pointBorderWidth: 2 }] }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: tooltipLabel } } }, scales: { x: { grid: { display: false }, ticks: { color: "#334155", font: { size: 10, weight: 700 }, maxRotation: 0, minRotation: 0 } }, y: { border: { display: false }, ticks: { color: "#64748b" }, grid: { color: "#e2e8f0" } } } }} /></div>
}
