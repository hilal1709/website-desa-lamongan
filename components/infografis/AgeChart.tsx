"use client"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
export function AgeChart({ data }: { data: { name: string; total: number }[] }) { return <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 20 }}><XAxis type="number" hide/><YAxis dataKey="name" type="category" width={50} tickLine={false} axisLine={false}/><Tooltip/><Bar dataKey="total" name="Penduduk" fill="#059669" radius={[0, 8, 8, 0]}/></BarChart></ResponsiveContainer></div> }
