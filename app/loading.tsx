function Skeleton({ className }: { className: string }) {
  return <div className={`rounded-2xl bg-current/10 ${className}`} />
}

function SectionTitleSkeleton() {
  return <div>
    <Skeleton className="h-3 w-28 bg-emerald-900/15" />
    <Skeleton className="mt-4 h-9 w-full max-w-xl bg-slate-900/10 sm:h-10" />
    <Skeleton className="mt-4 h-5 w-full max-w-2xl bg-slate-900/10" />
  </div>
}

export default function HomeLoading() {
  return (
    <main aria-busy="true" aria-live="polite" className="animate-pulse overflow-hidden bg-[#f3f7f3] text-slate-900">
      <section className="relative min-h-[520px] overflow-hidden bg-[#071b1d] px-4 py-20 sm:min-h-[560px] sm:px-6 lg:min-h-[620px] lg:px-8">
        <div className="absolute -right-12 top-24 size-64 rounded-full border border-emerald-100/10 bg-emerald-300/10 sm:right-[8%]" />
        <div className="mx-auto flex min-h-[440px] max-w-7xl items-center"><div className="w-full max-w-3xl"><p className="sr-only" role="status">Memuat beranda Desa Kedungrejo</p><Skeleton className="h-8 w-44 rounded-full bg-emerald-100/20" /><Skeleton className="mt-5 h-12 max-w-2xl bg-white/20 sm:h-16 lg:h-[72px]" /><Skeleton className="mt-4 h-6 max-w-xl bg-white/15" /><Skeleton className="mt-2 h-6 w-2/3 max-w-lg bg-white/15" /><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Skeleton className="h-12 w-full bg-emerald-200/25 sm:w-40" /><Skeleton className="h-12 w-full bg-white/15 sm:w-36" /></div><div className="mt-10 flex flex-wrap gap-3"><Skeleton className="h-9 w-32 rounded-full bg-white/15" /><Skeleton className="h-9 w-44 rounded-full bg-white/15" /></div></div></div>
      </section>

      <div className="relative z-10 mx-4 -mt-10 grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-emerald-950/10 shadow-2xl shadow-emerald-950/10 sm:mx-6 md:mx-auto md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[146px] bg-white p-5 sm:p-6"><Skeleton className="size-5 bg-emerald-700/15" /><Skeleton className="mt-4 h-8 w-20 bg-slate-900/10" /><Skeleton className="mt-2 h-4 w-24 bg-slate-900/10" /></div>)}</div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"><SectionTitleSkeleton /><div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-64 rounded-[28px] border border-emerald-950/5 bg-white p-5 shadow-sm"><Skeleton className="size-12 bg-emerald-700/10" /><Skeleton className="mt-6 h-6 w-3/4 bg-slate-900/10" /><Skeleton className="mt-4 h-4 w-full bg-slate-900/10" /><Skeleton className="mt-2 h-4 w-4/5 bg-slate-900/10" /><Skeleton className="mt-6 h-4 w-28 bg-emerald-700/10" /></div>)}</div></section>

      <section className="bg-[#eaf4ed] py-12 sm:py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><SectionTitleSkeleton /><div className="mt-9 grid gap-6 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-56 rounded-2xl border border-white/80 bg-white/85 p-5 shadow-sm"><Skeleton className="size-12 bg-emerald-700/10" /><Skeleton className="mt-6 h-6 w-2/3 bg-slate-900/10" /><Skeleton className="mt-4 h-4 w-full bg-slate-900/10" /><Skeleton className="mt-2 h-4 w-5/6 bg-slate-900/10" /></div>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"><SectionTitleSkeleton /><div className="mt-9 grid gap-5 lg:grid-cols-2">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-52 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><Skeleton className="h-6 w-3/5 bg-slate-900/10" /><Skeleton className="mt-6 h-4 w-full bg-slate-900/10" /><Skeleton className="mt-2 h-4 w-5/6 bg-slate-900/10" /><div className="mt-5 flex gap-2"><Skeleton className="h-9 w-24 bg-emerald-700/10" /><Skeleton className="h-9 w-20 bg-slate-900/10" /></div></div>)}</div></section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"><SectionTitleSkeleton /><div className="mt-9 grid gap-5 md:grid-cols-3"><div className="h-[330px] rounded-3xl bg-white shadow-sm md:col-span-2" /><div className="h-[330px] rounded-3xl bg-white shadow-sm" /></div><div className="mt-10 rounded-2xl bg-[#0b3d31] p-8"><Skeleton className="h-4 w-32 bg-emerald-100/20" /><Skeleton className="mt-4 h-9 w-full max-w-lg bg-white/20" /><div className="mt-6 flex gap-3"><Skeleton className="h-11 w-36 bg-emerald-200/25" /><Skeleton className="h-11 w-32 bg-white/15" /></div></div></section>
    </main>
  )
}
