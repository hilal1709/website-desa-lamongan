"use client"

import dynamic from "next/dynamic"

function ArchiveManagerFallback() {
  return <div aria-busy="true" className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"><section className="min-h-96 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="h-6 w-40 rounded-lg bg-slate-100" /><div className="mt-5 h-12 rounded-xl bg-slate-100" /><div className="mt-4 space-y-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-16 rounded-xl bg-slate-100" />)}</div></section><section className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="h-6 w-32 rounded-lg bg-slate-100" /><div className="mt-5 h-12 rounded-xl bg-slate-100" /><div className="mt-4 h-28 rounded-xl bg-slate-100" /></section></div>
}

export const LazyArchiveManager = dynamic(
  () => import("@/components/admin/archive-manager").then((module) => module.ArchiveManager),
  { ssr: false, loading: ArchiveManagerFallback },
)
