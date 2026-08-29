import type { ComponentType } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Database, UserCheck } from "./infographic-icons"

type WorkflowStep = {
  number: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
}

const workflow: readonly WorkflowStep[] = [
  { number: "01", title: "Data dasar", description: "Tetapkan jumlah jiwa, jumlah KK, dan komposisi awal tiap dusun.", icon: Database },
  { number: "02", title: "Peristiwa warga", description: "Catat kelahiran, kematian, dan perpindahan penduduk.", icon: BarChart3 },
  { number: "03", title: "Profil visual", description: "Lengkapi pendidikan dan pekerjaan tanpa mengubah total jiwa atau KK resmi.", icon: UserCheck },
]

export function CmsInfographicWorkflow() {
  return <section data-cms-infographic-hero aria-labelledby="cms-infographic-workflow-title">
    <Card className="relative overflow-hidden rounded-3xl border-emerald-200 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white shadow-lg shadow-emerald-950/15">
      <span data-cms-infographic-orb aria-hidden="true" className="pointer-events-none absolute -right-10 -top-14 size-52 rounded-full bg-teal-300/20 blur-3xl" />
      <span data-cms-infographic-orb-secondary aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-1/3 size-44 rounded-full bg-emerald-300/20 blur-3xl" />
      <CardHeader className="relative p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-200">Alur pembaruan data</p><CardTitle id="cms-infographic-workflow-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">Pastikan infografis selalu akurat</CardTitle><CardDescription className="max-w-2xl text-sm leading-6 text-emerald-50">Ikuti tiga tahap ini secara berurutan. Data resmi dan profil visual dipisahkan agar statistik publik tetap konsisten tanpa menampilkan informasi sensitif.</CardDescription></CardHeader>
      <CardContent className="relative grid gap-3 p-5 pt-0 sm:grid-cols-3 sm:p-7 sm:pt-0"><ol className="contents">{workflow.map(({ number, title, description, icon: Icon }) => <li key={number} data-cms-infographic-step className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><div className="flex items-center justify-between"><span className="text-xs font-black tracking-[.18em] text-emerald-200">{number}</span><span className="grid size-9 place-items-center rounded-xl bg-white/15 text-white"><Icon className="size-4" /></span></div><h3 className="mt-4 font-black text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-emerald-50">{description}</p><span data-cms-infographic-line aria-hidden="true" className="mt-4 block h-px bg-emerald-200/70" /></li>)}</ol></CardContent>
    </Card>
  </section>
}
