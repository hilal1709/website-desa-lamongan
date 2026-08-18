import { BarChart3 } from "lucide-react"
import { PopulationEventManager } from "@/components/infografis/population-event-manager"

export const metadata = { title: "Kelola Infografis | Admin Kedungrejo" }

export default function AdminInfografisPage() { return <section aria-labelledby="kelola-infografis-desa-title" className="min-h-screen bg-slate-50 px-1 py-4 sm:px-3 sm:py-8 lg:px-5 lg:py-10" suppressHydrationWarning><div className="mx-auto max-w-4xl"><header className="rounded-3xl bg-gradient-to-br from-green-800 to-emerald-700 p-5 text-white shadow-lg shadow-green-900/15 sm:p-9"><span className="grid size-12 place-items-center rounded-2xl bg-white/15"><BarChart3 size={24} aria-hidden="true"/></span><h1 id="kelola-infografis-desa-title" className="mt-5 text-2xl font-bold tracking-tight sm:mt-6 sm:text-3xl">Kelola Infografis Desa</h1><p className="mt-3 max-w-xl text-sm leading-7 text-green-50 sm:text-base">Kelola saldo awal penduduk dan catat peristiwa kelahiran, kematian, pindah masuk, serta pindah keluar warga.</p></header><section className="mt-5 sm:mt-7"><PopulationEventManager /></section></div></section> }
