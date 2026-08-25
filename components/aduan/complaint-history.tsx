import { MessageCircleMore } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import type { ComplaintSummary } from "@/lib/complaints"

type ComplaintHistoryProps = {
  title?: string
  complaints: ComplaintSummary[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" })

export function ComplaintHistory({ title = "Aduan terbaru", complaints }: ComplaintHistoryProps) {
  return (
    <section className="complaint-history" aria-labelledby="complaint-history-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Transparansi layanan</p>
          <h2 id="complaint-history-title" className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">{title}</h2>
        </div>
        <StatusBadge>{complaints.length} aduan</StatusBadge>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-lg shadow-slate-950/[0.04]">
        <CardContent className="p-0">
          {complaints.length === 0 && <p className="p-8 text-center text-sm leading-6 text-slate-500">Belum ada aduan yang ditampilkan.</p>}
          {complaints.map((complaint, index) => (
            <article key={complaint.id} className={`complaint-row flex items-start gap-3 p-5 ${index > 0 ? "border-t border-slate-100" : ""}`}>
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><MessageCircleMore aria-hidden size={18} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="font-bold leading-5 text-slate-900">{complaint.title}</h3><StatusBadge tone={complaint.status === "Selesai" ? "emerald" : "amber"}>{complaint.status}</StatusBadge></div>
                <p className="mt-1.5 text-sm leading-5 text-slate-500">{complaint.category} · {complaint.location} · <time dateTime={complaint.createdAt}>{dateFormatter.format(new Date(complaint.createdAt))}</time></p>
                {complaint.publicResponse ? <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm leading-5 text-emerald-950"><p className="font-bold">Tanggapan petugas</p><p className="mt-1 whitespace-pre-wrap">{complaint.publicResponse}</p></div> : null}
              </div>
            </article>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
