import { DisasterMapPinnedIcon, DisasterRadioIcon, DisasterShieldCheckIcon } from "@/components/bencana/disaster-icons"
import { Card, CardContent } from "@/components/ui/card"

export function DisasterCommandCenter() {
  return (
    <aside aria-label="Ringkasan layanan peta bencana">
      <Card className="disaster-command-card relative overflow-hidden rounded-3xl border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 shadow-sm sm:rounded-[32px]">
        <div data-disaster-orb className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-emerald-200/50 blur-3xl" />
        <CardContent className="relative grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
          <div className="flex items-start gap-3">
            <div data-disaster-icon className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/20"><DisasterMapPinnedIcon className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Pusat kesiapsiagaan desa</p>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-600">Pantau prakiraan, rencana aktivitas, dan titik respons dalam satu peta terpadu.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-emerald-800"><DisasterRadioIcon data-disaster-pulse className="h-3.5 w-3.5" /> Pembaruan realtime</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"><DisasterShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" /> Informasi resmi desa</span>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
