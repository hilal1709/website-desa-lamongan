"use client"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
const colors = ["#2563eb", "#059669", "#f59e0b", "#7c3aed"]
export function EducationChart({ data }: { data: { name: string; total: number }[] }) { return <div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="total" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={4}>{data.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div> }
