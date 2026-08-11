"use client"

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { InfographicStat } from "@/types"

const tooltipStyle = { borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 12px 28px rgb(15 23 42 / 0.12)" }

export function PopulationByDusunChart({ data }: { data: InfographicStat[] }) {
  return <div className="h-80 sm:h-96"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}><XAxis dataKey="dusun" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} interval={0}/><YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }}/><Tooltip cursor={{ fill: "#eff6ff" }} contentStyle={tooltipStyle} formatter={(value) => [new Intl.NumberFormat("id-ID").format(Number(value)), "Penduduk"]}/><Bar dataKey="total_population" name="Penduduk" radius={[10, 10, 2, 2]} fill="#2563eb" maxBarSize={58}/></BarChart></ResponsiveContainer></div>
}

export function GenderChart({ male, female }: { male: number; female: number }) {
  const data = [{ name: "Laki-laki", value: male, color: "#2563eb" }, { name: "Perempuan", value: female, color: "#059669" }]
  return <div className="h-80 sm:h-96"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={4}>{data.map((entry) => <Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value) => new Intl.NumberFormat("id-ID").format(Number(value))}/></PieChart></ResponsiveContainer><div className="-mt-11 flex justify-center gap-5 text-sm font-semibold text-slate-600">{data.map((entry) => <span key={entry.name} className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }}/>{entry.name}</span>)}</div></div>
}
