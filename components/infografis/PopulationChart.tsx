"use client"

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const dusunColors: Record<string, string> = {
  "Dusun Topang": "#059669",      // Emerald
  "Dusun Karangpilang": "#0d9488", // Teal
  "Dusun Dopok Sambi": "#2563eb",  // Blue
  "Dusun Gabang": "#d97706",        // Amber
}

const defaultColors = ["#059669", "#0d9488", "#2563eb", "#d97706", "#7c3aed"]

export function PopulationChart({ data }: { data: { dusun: string; total_population: number }[] }) {
  return (
    <div className="space-y-4">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="dusun"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 12, fontWeight: 700, fill: "#334155" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              formatter={(val: any) => [`${new Intl.NumberFormat("id-ID").format(Number(val))} Jiwa`, "Jumlah Penduduk"]}
              contentStyle={{ borderRadius: "16px", borderColor: "#e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
            />
            <Bar dataKey="total_population" name="Penduduk" radius={[12, 12, 0, 0]}>
              {data.map((item, index) => (
                <Cell
                  key={item.dusun}
                  fill={dusunColors[item.dusun] || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Badge per Dusun for Easy Identification */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 border-t border-slate-100 pt-3">
        {data.map((item, index) => {
          const color = dusunColors[item.dusun] || defaultColors[index % defaultColors.length]
          return (
            <div key={item.dusun} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }}></span>
              <div>
                <p className="text-[11px] font-bold text-slate-700">{item.dusun}</p>
                <p className="text-xs font-black text-slate-900">
                  {new Intl.NumberFormat("id-ID").format(item.total_population)} Jiwa
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
