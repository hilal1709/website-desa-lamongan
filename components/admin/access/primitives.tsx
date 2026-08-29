import type { ReactNode } from "react"
import { Users } from "@/components/admin/access/icons"

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-bold text-slate-700"><span>{label}</span>{children}</label>
}

export function AccessStat({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: number; tone: "emerald" | "sky" | "violet" }) {
  const styles = { emerald: "bg-emerald-700 text-white", sky: "bg-sky-600 text-white", violet: "bg-violet-600 text-white" }
  return <div data-access-stat className="rounded-2xl border border-white/70 bg-white/85 p-3 shadow-sm shadow-slate-900/5 backdrop-blur"><div className="flex items-center gap-3"><span className={`grid size-9 place-items-center rounded-xl ${styles[tone]}`}><Icon className="size-4" /></span><div><p className="text-xl font-black leading-none text-slate-950">{value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div></div></div>
}
