function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-2xl bg-white/15 ${className}`} />
}

export default function HomeLoading() {
  return (
    <main aria-busy="true" aria-live="polite" className="animate-pulse bg-[#f3f7f3]">
      <section className="min-h-[560px] bg-emerald-950 px-5 py-28 sm:px-6 lg:min-h-[620px] lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="sr-only" role="status">Memuat beranda Desa Kedungrejo</p>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-7 h-14 max-w-2xl sm:h-20" />
          <Skeleton className="mt-4 h-6 max-w-xl" />
          <Skeleton className="mt-2 h-6 w-2/3 max-w-lg" />
          <div className="mt-10 flex gap-3"><Skeleton className="h-12 w-40" /><Skeleton className="h-12 w-36" /></div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-4 grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-3xl bg-emerald-900/10 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-none bg-white" />)}
      </div>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <Skeleton className="h-4 w-28 bg-slate-200" />
        <Skeleton className="mt-4 h-10 max-w-xl bg-slate-200" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-64 bg-white" />)}
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5"><Skeleton className="h-10 max-w-lg bg-slate-200" /><div className="mt-10 grid gap-5 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-52 bg-white" />)}</div></div>
      </section>
    </main>
  )
}
