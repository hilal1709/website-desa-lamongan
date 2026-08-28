"use client"

import dynamic from "next/dynamic"

function ManagerFallback() {
  return <div aria-busy="true" aria-label="Menyiapkan panel pengelolaan bencana" className="space-y-5"><div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" /><div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" /></div>
}

export const LazyAdminDisasterManager = dynamic(
  () => import("@/components/bencana/admin-disaster-manager").then((module) => module.AdminDisasterManager),
  { loading: ManagerFallback },
)
