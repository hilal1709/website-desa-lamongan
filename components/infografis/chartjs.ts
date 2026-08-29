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
import type { ChartType, TooltipItem } from "chart.js"

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

export const tooltipLabel = (context: TooltipItem<ChartType>) => {
  // `parsed.x` is only the category index on vertical bar charts. The raw
  // dataset value is reliable for bar, line, and doughnut visualizations.
  const value = typeof context.raw === "number" ? context.raw : typeof context.parsed === "number" ? context.parsed : (context.parsed.y ?? context.parsed.x ?? context.parsed.r ?? 0)
  return `${context.dataset.label ?? "Jumlah"}: ${numberFormatter.format(Math.abs(value))} Jiwa`
}
