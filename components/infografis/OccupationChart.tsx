"use client"

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const occupationColors: Record<string, string> = {
  Petani: "#059669",                  // Emerald (Agrarian)
  "UMKM/Wirausaha": "#d97706",        // Amber (Business)
  "Karyawan Swasta": "#2563eb",       // Blue (Private Sector)
  "PNS/ASN": "#4f46e5",               // Indigo (Government)
  "Guru/Tenaga Pendidikan": "#7c3aed",// Purple (Education)
  "Perangkat Desa": "#0f766e",        // Dark Teal (Village Gov)
  "Pelajar/Mahasiswa": "#0284c7",     // Sky Blue (Students)
  "Belum/Tidak Bekerja": "#64748b"    // Slate (Other)
}

const defaultPalette = ["#059669", "#d97706", "#2563eb", "#4f46e5", "#7c3aed", "#0f766e", "#0284c7", "#64748b"]

export function OccupationChart({ data }: { data: { name: string; total: number }[] }) {
  const top = [...data].sort((a, b) => b.total - a.total).slice(0, 5)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Donut Chart View */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center sm:text-left">
          Distribusi Sektor Pekerjaan
        </h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="name"
                innerRadius="50%"
                outerRadius="78%"
                paddingAngle={3}
              >
                {data.map((item, index) => {
                  const color = occupationColors[item.name] || defaultPalette[index % defaultPalette.length]
                  return <Cell key={item.name} fill={color} stroke="#ffffff" strokeWidth={2} />
                })}
              </Pie>
              <Tooltip
                formatter={(val: any) => [`${new Intl.NumberFormat("id-ID").format(Number(val))} Jiwa`, "Jumlah Pekerja"]}
                contentStyle={{ borderRadius: "16px", borderColor: "#e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Top 5 View */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center sm:text-left">
          5 Pekerjaan Terbanyak Warga
        </h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top} layout="vertical" margin={{ left: 35, right: 15 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 11, fontWeight: 700, fill: "#334155" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(val: any) => [`${new Intl.NumberFormat("id-ID").format(Number(val))} Jiwa`, "Jumlah Pekerja"]}
                contentStyle={{ borderRadius: "16px", borderColor: "#e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                {top.map((item, index) => {
                  const color = occupationColors[item.name] || defaultPalette[index % defaultPalette.length]
                  return <Cell key={item.name} fill={color} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
