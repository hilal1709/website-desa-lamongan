import { ComplaintCheckIcon, ComplaintFormIcon, ComplaintShieldIcon } from "@/components/aduan/complaint-icons"

const complaintSteps = [
  { icon: ComplaintFormIcon, title: "Isi laporan", description: "Sampaikan detail kejadian." },
  { icon: ComplaintShieldIcon, title: "Kami verifikasi", description: "Petugas menelaah aduan." },
  { icon: ComplaintCheckIcon, title: "Pantau hasil", description: "Ikuti status tindak lanjut." },
] as const

export function ComplaintFlow() {
  return (
    <section className="mb-8 max-w-4xl" aria-labelledby="complaint-flow-title">
      <h2 id="complaint-flow-title" className="sr-only">Alur pengaduan warga</h2>
      <ol className="complaint-steps grid gap-3 sm:grid-cols-3 sm:gap-4">
        {complaintSteps.map(({ icon: Icon, title, description }, index) => <li key={title} className="complaint-step relative flex min-w-0 items-center gap-3 rounded-2xl border border-white/80 bg-white/80 p-3.5 shadow-sm shadow-emerald-950/[0.03] backdrop-blur sm:block sm:p-4">
          <span className="complaint-step-number absolute right-3 top-2 text-3xl font-black text-emerald-950/[0.045]">0{index + 1}</span>
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800"><Icon aria-hidden size={17} /></span>
          <span className="relative min-w-0"><strong className="block break-words text-sm font-bold text-slate-900">{title}</strong><span className="block break-words text-xs leading-5 text-slate-500">{description}</span></span>
        </li>)}
      </ol>
    </section>
  )
}
