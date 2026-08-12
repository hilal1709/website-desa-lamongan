import type { LucideIcon } from "lucide-react"

export function StatCard({ label, value, icon: Icon, tone = "blue" }: { label: string; value: number; icon: LucideIcon; tone?: "blue" | "emerald" }) {
  const styles = tone === "blue" ? "bg-blue-50 text-blue-700 ring-blue-100" : "bg-emerald-50 text-emerald-700 ring-emerald-100"
  return <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6"><div className={`grid size-11 place-items-center rounded-2xl ring-1 ${styles}`}><Icon size={21}/></div><p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">{new Intl.NumberFormat("id-ID").format(value)}</p><p className="mt-1 text-sm font-medium text-slate-500">{label}</p></div>
}
