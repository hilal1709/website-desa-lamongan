import { ComplaintCheckIcon, ComplaintClockIcon, ComplaintMessageIcon } from "@/components/aduan/complaint-icons"
import { ComplaintPagination } from "@/components/aduan/complaint-pagination"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import type { ComplaintSummary } from "@/lib/complaint-types"

type ComplaintHistoryProps = {
  title?: string
  complaints: ComplaintSummary[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" })

export function ComplaintHistory({ title = "Aduan terbaru", complaints = [], page, pageSize, totalItems, totalPages, isLoading, onPageChange }: ComplaintHistoryProps) {
  return (
    <section className="complaint-history min-w-0" aria-labelledby="complaint-history-title">
      <div className="mb-5 flex items-start justify-between gap-3 sm:items-end sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Transparansi layanan</p>
          <h2 id="complaint-history-title" className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">{title}</h2>
        </div>
        <StatusBadge>{totalItems} aduan</StatusBadge>
      </div>

      <div className="complaint-history-note mb-4 flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 text-sm leading-5 text-emerald-950">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm"><ComplaintClockIcon aria-hidden size={17} /></div>
        <p className="min-w-0 break-words"><strong className="font-bold">Status diperbarui oleh petugas.</strong> Tanggapan publik akan muncul di setiap laporan yang telah ditindaklanjuti.</p>
      </div>

      <Card className="min-w-0 overflow-hidden border-slate-200 shadow-lg shadow-slate-950/[0.04]">
        <CardContent className="p-0">
          {complaints.length === 0 && <p className="p-8 text-center text-sm leading-6 text-slate-500">Belum ada aduan yang ditampilkan.</p>}
          <ol aria-busy={isLoading} aria-live="polite">
            {complaints.map((complaint, index) => (
              <li key={complaint.id} className={`complaint-row flex min-w-0 items-start gap-3 p-4 sm:p-5 ${index > 0 ? "border-t border-slate-100" : ""}`}>
                <article className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><ComplaintMessageIcon aria-hidden size={18} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2"><h3 className="min-w-0 break-words font-bold leading-5 text-slate-900">{complaint.title}</h3><StatusBadge tone={complaint.status === "Selesai" ? "emerald" : "amber"}>{complaint.status}</StatusBadge></div>
                    <p className="mt-1.5 break-words text-sm leading-5 text-slate-500">{complaint.category} · {complaint.location} · <time dateTime={complaint.createdAt}>{dateFormatter.format(new Date(complaint.createdAt))}</time></p>
                    {complaint.publicResponse ? <div className="complaint-response mt-3 break-words rounded-xl bg-emerald-50 px-3 py-2.5 text-sm leading-5 text-emerald-950"><p className="flex items-center gap-1.5 font-bold"><ComplaintCheckIcon aria-hidden size={15} />Tanggapan petugas</p><p className="mt-1 whitespace-pre-wrap">{complaint.publicResponse}</p></div> : null}
                  </div>
                </article>
              </li>
            ))}
          </ol>
          <ComplaintPagination page={page} pageSize={pageSize} totalItems={totalItems} totalPages={totalPages} isLoading={isLoading} onPageChange={onPageChange} />
        </CardContent>
      </Card>
    </section>
  )
}
