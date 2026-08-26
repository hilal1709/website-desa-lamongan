function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/15 ${className}`} />
}

export default function ProfilLoading() {
  return (
    <main aria-busy="true" aria-live="polite" className="min-h-screen bg-[#f4f8f4]">
      <section className="relative -mt-[88px] min-h-[500px] overflow-hidden bg-emerald-950 px-4 pb-12 pt-[136px] text-white sm:min-h-[600px] sm:px-5 sm:pb-16 sm:pt-[168px] lg:min-h-[640px]">
        <div className="absolute inset-0 bg-emerald-950" />
        <div className="relative mx-auto max-w-7xl">
          <p className="sr-only" role="status">Memuat profil Desa Kedungrejo</p>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-transparent" aria-hidden="true" />
          </div>
          <Skeleton className="mt-8 h-4 w-32 bg-emerald-200/30" />
          <Skeleton className="mt-5 h-14 max-w-3xl sm:h-20" />
          <Skeleton className="mt-4 h-14 max-w-xl" />
          <Skeleton className="mt-8 h-16 w-56 rounded-2xl bg-emerald-100/20" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:py-20">
        <section className="grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Skeleton className="h-4 w-28 bg-slate-200" />
            <Skeleton className="mt-4 h-10 max-w-xl bg-slate-200" />
            <Skeleton className="mt-5 h-24 max-w-2xl bg-slate-200" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2"><Skeleton className="h-32 bg-white" /><Skeleton className="h-32 bg-white" /></div>
          </div>
          <Skeleton className="min-h-[250px] rounded-3xl bg-emerald-900/15 sm:min-h-[320px] sm:rounded-[32px]" />
        </section>
        <Skeleton className="mt-12 h-[420px] rounded-3xl bg-white sm:mt-16 sm:rounded-[32px]" />
        <Skeleton className="mt-12 h-52 rounded-3xl bg-white sm:mt-16 sm:rounded-[32px]" />
        <Skeleton className="mt-12 h-[340px] rounded-3xl bg-slate-200 sm:mt-16 sm:h-[500px] sm:rounded-[32px]" />
      </div>
    </main>
  )
}
