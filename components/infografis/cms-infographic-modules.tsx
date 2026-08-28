"use client"

import dynamic from "next/dynamic"
import type { BalanceRecord, EventRecord } from "./population-event-manager"
import type { Resident } from "./resident-manager"

const PopulationEventManager = dynamic(() => import("./population-event-manager").then((module) => module.PopulationEventManager), { loading: ModuleLoading })
const ResidentManager = dynamic(() => import("./resident-manager").then((module) => module.ResidentManager), { loading: ModuleLoading })

function ModuleLoading() {
  return <div aria-busy="true" className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><span className="block h-5 w-52 animate-pulse rounded-lg bg-slate-200" /><span className="block h-4 max-w-xl animate-pulse rounded-lg bg-slate-100" /><div className="grid gap-3 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <span key={index} className="block h-12 animate-pulse rounded-xl bg-slate-100" />)}</div></div>
}

export function CmsInfographicModules({ initialEvents, initialBalances, initialResidents }: { initialEvents: EventRecord[]; initialBalances: BalanceRecord[]; initialResidents: Resident[] }) {
  return <><PopulationEventManager initialEvents={initialEvents} initialBalances={initialBalances} /><ResidentManager initialResidents={initialResidents} /></>
}
