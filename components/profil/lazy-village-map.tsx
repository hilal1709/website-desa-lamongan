"use client"

import dynamic from "next/dynamic"

const VillageMap = dynamic(() => import("./village-map").then((module) => module.VillageMap), {
  ssr: false,
  loading: () => <div className="h-[300px] rounded-3xl border border-slate-200 bg-slate-100 sm:h-[500px]" aria-label="Menyiapkan peta desa" />,
})

type LazyVillageMapProps = {
  eyebrow: string
  title: string
  description: string
  action: string
  href: string
}

export function LazyVillageMap(props: LazyVillageMapProps) {
  return <VillageMap {...props} />
}
