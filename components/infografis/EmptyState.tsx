import { MapPinned } from "lucide-react"

export function EmptyState({ title = "Data belum tersedia", description = "Belum ada data sesuai filter yang dipilih." }: { title?: string; description?: string }) {
  return <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><MapPinned className="mx-auto text-emerald-700" size={28}/><h2 className="mt-4 text-xl font-bold">{title}</h2><p className="mt-2 text-slate-600">{description}</p></div>
}
