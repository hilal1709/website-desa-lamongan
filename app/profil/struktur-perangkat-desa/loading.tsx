function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />
}

export default function StrukturPerangkatDesaLoading() {
  return (
    <main aria-busy="true" aria-live="polite" className="min-h-screen bg-[#f4f8f4]">
      <section className="relative -mt-[88px] min-h-[520px] overflow-hidden bg-emerald-950 px-5 pb-16 pt-[156px] text-white sm:min-h-[600px] sm:pb-20 sm:pt-[168px] lg:min-h-[640px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(52,211,153,0.25),transparent_28%),linear-gradient(120deg,#06251e,#0a4632)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="sr-only" role="status">Memuat struktur perangkat desa</p>
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-100 border-t-transparent" aria-hidden="true" />
          </div>
          <Skeleton className="mt-8 h-4 w-28 bg-emerald-200/30" />
          <Skeleton className="mt-5 h-14 max-w-3xl bg-white/15 sm:h-20" />
          <Skeleton className="mt-5 h-8 max-w-xl bg-white/15" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-16">
        <Skeleton className="mx-auto mb-6 h-5 max-w-5xl" />
        <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:px-8">
            <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-2xl bg-emerald-100" /><Skeleton className="h-5 w-52" /></div>
            <div className="grid w-full grid-cols-1 gap-2 min-[430px]:grid-cols-2 sm:flex sm:w-auto"><Skeleton className="h-9 w-full sm:w-32" /><Skeleton className="h-9 w-full bg-emerald-100 sm:w-28" /></div>
          </div>
          <div className="p-3 sm:p-8"><Skeleton className="h-[300px] w-full rounded-xl sm:h-[620px] sm:rounded-2xl" /></div>
        </section>
      </div>
    </main>
  )
}
