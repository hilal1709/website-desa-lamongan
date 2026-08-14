"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function TrendChart({ data }: { data: { year: number; total_population: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
            tick={{ fontSize: 12, fontWeight: 700, fill: "#334155" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            domain={["dataMin - 100", "dataMax + 100"]}
          />
          <Tooltip
            formatter={(val: any) => [`${new Intl.NumberFormat("id-ID").format(Number(val))} Jiwa`, "Jumlah Penduduk"]}
            contentStyle={{ borderRadius: "16px", borderColor: "#e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          />
          <Area
            type="monotone"
            dataKey="total_population"
            name="Penduduk"
            stroke="#059669"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#trendGradient)"
            dot={{ r: 6, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
            activeDot={{ r: 8, fill: "#047857" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
