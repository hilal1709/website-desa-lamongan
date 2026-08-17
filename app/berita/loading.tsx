import { LoaderCircle } from "lucide-react"

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />
}

export default function LoadingBerita() {
  return <main aria-busy="true" aria-live="polite" className="min-h-screen bg-slate-50">
    <section className="relative -mt-[88px] flex min-h-[480px] items-center overflow-hidden bg-emerald-950 px-4 pb-12 pt-[144px] sm:min-h-[600px] sm:px-6 sm:pb-20 sm:pt-[168px] lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.2),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(20,184,166,0.16),transparent_36%)]" />
      <div className="relative mx-auto w-full max-w-7xl"><div className="flex items-center gap-2 text-emerald-200"><LoaderCircle className="size-4 animate-spin" /><span className="text-sm font-bold uppercase tracking-[0.2em]">Memuat berita</span></div><Skeleton className="mt-5 h-14 max-w-3xl bg-white/15 sm:h-20" /><Skeleton className="mt-5 h-6 max-w-2xl bg-white/10" /><Skeleton className="mt-2 h-6 w-2/3 max-w-lg bg-white/10" /><div className="mt-10 h-1 w-48 overflow-hidden rounded-full bg-white/15"><div className="h-full w-1/2 animate-[pulse_0.9s_ease-in-out_infinite] rounded-full bg-emerald-300" /></div></div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8"><Skeleton className="h-[380px] bg-slate-200 sm:h-[500px]" /><div className="my-10 flex items-center gap-3 sm:my-12 sm:gap-4"><Skeleton className="h-px flex-1 rounded-none" /><Skeleton className="h-4 w-24 sm:w-28" /><Skeleton className="h-px flex-1 rounded-none" /></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><Skeleton className="aspect-video rounded-none" /><div className="space-y-3 p-4 sm:p-5"><Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-full" /><Skeleton className="h-5 w-4/5" /><Skeleton className="mt-5 h-4 w-32" /></div></div>)}</div></section>
  </main>
}
