"use client"

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js"

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
)

export const numberFormatter = new Intl.NumberFormat("id-ID")

export const tooltipLabel = (context: any) => {
  const value = typeof context.parsed === "number" ? context.parsed : (context.parsed.x ?? context.parsed.y ?? context.parsed.r ?? 0)
  return `${context.dataset.label ?? "Jumlah"}: ${numberFormatter.format(Math.abs(value))} Jiwa`
}
