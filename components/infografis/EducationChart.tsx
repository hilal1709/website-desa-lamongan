"use client"

import { Doughnut } from "react-chartjs-2"
import { tooltipLabel } from "./chartjs"

const colors = ["#10b981", "#14b8a6", "#3b82f6", "#6366f1"]

export function EducationChart({ data }: { data: { name: string; total: number }[] }) {
  return <div className="h-56 sm:h-64"><Doughnut data={{ labels: data.map((item) => item.name), datasets: [{ label: "Tingkat Pendidikan", data: data.map((item) => item.total), backgroundColor: data.map((_, index) => colors[index % colors.length]), borderColor: "#fff", borderWidth: 3, spacing: 4 }] }} options={{ maintainAspectRatio: false, cutout: "55%", plugins: { legend: { position: "bottom", labels: { boxWidth: 9, usePointStyle: true, padding: 10 } }, tooltip: { callbacks: { label: tooltipLabel } } } }} /></div>
}
