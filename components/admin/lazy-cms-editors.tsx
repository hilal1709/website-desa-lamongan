"use client"

import dynamic from "next/dynamic"

function EditorFallback() {
  return <div aria-busy="true" className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"><div className="animate-pulse space-y-4"><div className="h-10 w-48 rounded-xl bg-slate-100" /><div className="grid gap-4 md:grid-cols-2"><div className="h-12 rounded-xl bg-slate-100" /><div className="h-12 rounded-xl bg-slate-100" /></div><div className="h-36 rounded-2xl bg-slate-100" /></div></div>
}

export const LazyCmsPageEditor = dynamic(
  () => import("@/components/admin/cms-page-editor").then((module) => module.CmsPageEditor),
  { ssr: false, loading: EditorFallback },
)

export const LazyNewsManager = dynamic(
  () => import("@/components/admin/news-manager").then((module) => module.NewsManager),
  { loading: EditorFallback },
)

export const LazyUmkmManager = dynamic(
  () => import("@/components/admin/umkm-manager").then((module) => module.UmkmManager),
  { loading: EditorFallback },
)
