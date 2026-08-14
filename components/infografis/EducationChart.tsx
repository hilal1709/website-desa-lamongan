"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const educationColors: Record<string, string> = {
  SD: "#10b981",              // Emerald
  SMP: "#14b8a6",             // Teal
  SMA: "#3b82f6",             // Royal Blue
  "Perguruan Tinggi": "#6366f1" // Indigo
}

const defaultColors = ["#10b981", "#14b8a6", "#3b82f6", "#6366f1"]

export function EducationChart({ data }: { data: { name: string; total: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="name"
            innerRadius="55%"
            outerRadius="82%"
            paddingAngle={4}
          >
            {data.map((item, index) => {
              const color = educationColors[item.name] || defaultColors[index % defaultColors.length]
              return <Cell key={item.name} fill={color} stroke="#ffffff" strokeWidth={2} />
            })}
          </Pie>
          <Tooltip
            formatter={(val: any) => [`${new Intl.NumberFormat("id-ID").format(Number(val))} Jiwa`, "Tingkat Pendidikan"]}
            contentStyle={{ borderRadius: "16px", borderColor: "#e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
