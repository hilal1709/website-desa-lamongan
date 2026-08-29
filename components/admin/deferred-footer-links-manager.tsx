"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import type { SiteRedirectRule, SiteSettings } from "@/lib/site-settings"

const FooterLinksManager = dynamic(() => import("@/components/admin/footer-links-manager").then((module) => module.FooterLinksManager), { ssr: false })

export function DeferredFooterLinksManager({ initialSettings, initialRedirects }: { initialSettings: SiteSettings; initialRedirects: SiteRedirectRule[] }) {
  const trigger = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!trigger.current) return
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setReady(true); observer.disconnect() } }, { rootMargin: "320px 0px" })
    observer.observe(trigger.current)
    return () => observer.disconnect()
  }, [])

  return <div ref={trigger}>{ready ? <FooterLinksManager initialSettings={initialSettings} initialRedirects={initialRedirects} /> : <section aria-busy="true" className="mt-5 h-40 rounded-3xl border border-emerald-100 bg-white/70 p-5 shadow-sm"><span className="block h-5 w-52 animate-pulse rounded-lg bg-slate-200" /><span className="mt-3 block h-4 w-full max-w-md animate-pulse rounded-lg bg-slate-100" /><div className="mt-6 grid gap-3 sm:grid-cols-2"><span className="h-11 animate-pulse rounded-xl bg-slate-100" /><span className="h-11 animate-pulse rounded-xl bg-slate-100" /></div></section>}</div>
}
