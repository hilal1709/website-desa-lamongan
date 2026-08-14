"use client"

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const ageCategoryColors: Record<string, { color: string; label: string }> = {
  "0-5": { color: "#0284c7", label: "Balita (0-5 th)" },
  "6-17": { color: "#0d9488", label: "Anak & Remaja (6-17 th)" },
  "18-35": { color: "#059669", label: "Pemuda / Produktif (18-35 th)" },
  "36-59": { color: "#4f46e5", label: "Dewasa / Kerja (36-59 th)" },
  "60+": { color: "#d97706", label: "Lansia / Senior (60+ th)" }
}

const defaultColors = ["#0284c7", "#0d9488", "#059669", "#4f46e5", "#d97706"]

export function AgeChart({ data }: { data: { name: string; total: number }[] }) {
  const totalWarga = data.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={55}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fontWeight: 700, fill: "#334155" }}
            />
            <Tooltip
              formatter={(val: any) => [`${new Intl.NumberFormat("id-ID").format(Number(val))} Jiwa`, "Jumlah"]}
              contentStyle={{ borderRadius: "16px", borderColor: "#e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
            />
            <Bar dataKey="total" name="Penduduk" radius={[0, 10, 10, 0]}>
              {data.map((item, index) => {
                const config = ageCategoryColors[item.name]
                return <Cell key={item.name} fill={config?.color || defaultColors[index % defaultColors.length]} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Categorized Legend & Percentage */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 border-t border-slate-100 pt-3">
        {data.map((item, index) => {
          const config = ageCategoryColors[item.name]
          const color = config?.color || defaultColors[index % defaultColors.length]
          const label = config?.label || `Kelompok ${item.name}`
          const percent = totalWarga > 0 ? ((item.total / totalWarga) * 100).toFixed(1) : "0"

          return (
            <div key={item.name} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }}></span>
              <div>
                <p className="text-[11px] font-bold text-slate-700">{label}</p>
                <p className="text-xs font-black text-slate-900">
                  {new Intl.NumberFormat("id-ID").format(item.total)} Jiwa <span className="font-semibold text-slate-500">({percent}%)</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
