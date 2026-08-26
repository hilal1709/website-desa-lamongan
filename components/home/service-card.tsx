import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Service } from "@/types"

const tones = { blue: "bg-sky-50 text-sky-700", emerald: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700" }

export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon

  return <Link href={service.href} className="home-service-card group">
    <Card className="relative h-full overflow-hidden rounded-[28px] border-emerald-950/5 bg-white shadow-[0_10px_28px_rgba(15,59,47,0.05)] transition duration-300 group-hover:-translate-y-1.5 group-hover:border-emerald-200 group-hover:shadow-[0_18px_40px_rgba(15,59,47,0.13)]">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-emerald-50/70 transition group-hover:bg-emerald-100" />
      <CardHeader className="relative">
        <span className={`grid size-12 place-items-center rounded-2xl ${tones[service.tone ?? "blue"]}`}><Icon size={23} /></span>
        <CardTitle className="mt-4 text-xl text-slate-900 transition group-hover:text-emerald-800">{service.title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {service.description && <p className="text-sm leading-6 text-slate-500">{service.description}</p>}
        <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-emerald-700">Akses layanan <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
      </CardContent>
    </Card>
  </Link>
}
