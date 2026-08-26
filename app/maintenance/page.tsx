import type { Metadata } from "next"
import { Wrench } from "lucide-react"
import { getSiteSettings } from "@/lib/site-settings"

export const metadata: Metadata = { title: "Sedang dalam pemeliharaan", robots: { index: false, follow: false } }

export default async function MaintenancePage() {
  const settings = await getSiteSettings()
  return <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-center text-white"><section className="max-w-xl"><span className="mx-auto grid size-16 place-items-center rounded-3xl bg-emerald-400 text-slate-950"><Wrench className="size-8" /></span><p className="mt-8 text-xs font-black uppercase tracking-[.2em] text-emerald-300">{settings.villageName}</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Website sedang dalam pemeliharaan</h1><p className="mt-5 text-base leading-7 text-slate-300">{settings.maintenanceMessage}</p></section></main>
}
