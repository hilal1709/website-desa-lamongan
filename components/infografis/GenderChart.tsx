"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export function GenderChart({ male, female }: { male: number; female: number }) {
  const data = [
    { name: "Laki-laki", value: male, color: "#1d4ed8" }, // Deep Royal Blue
    { name: "Perempuan", value: female, color: "#059669" }  // Vibrant Emerald Green
  ]

  const total = male + female
  const malePercent = total > 0 ? ((male / total) * 100).toFixed(1) : "50"
  const femalePercent = total > 0 ? ((female / total) * 100).toFixed(1) : "50"

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={4}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: any) => [`${new Intl.NumberFormat("id-ID").format(Number(val))} Jiwa`, "Jumlah"]}
              contentStyle={{ borderRadius: "16px", borderColor: "#e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Categorized Visual Legend Pills */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
          <div className="h-4 w-4 shrink-0 rounded-full bg-blue-700"></div>
          <div>
            <p className="text-xs font-bold text-blue-900">Laki-laki</p>
            <p className="text-sm font-black text-blue-950">
              {new Intl.NumberFormat("id-ID").format(male)} <span className="text-xs font-semibold text-blue-700">({malePercent}%)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
          <div className="h-4 w-4 shrink-0 rounded-full bg-emerald-600"></div>
          <div>
            <p className="text-xs font-bold text-emerald-900">Perempuan</p>
            <p className="text-sm font-black text-emerald-950">
              {new Intl.NumberFormat("id-ID").format(female)} <span className="text-xs font-semibold text-emerald-700">({femalePercent}%)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
