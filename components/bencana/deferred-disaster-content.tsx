"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

function LoadingBlock() {
  return <div className="h-52 animate-pulse rounded-3xl border border-slate-200 bg-slate-100 sm:h-64" aria-label="Memuat konten" />
}

export function DeferredDisasterContent({ children, label }: { children: ReactNode; label: string }) {
  const root = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsReady(true)
      observer.disconnect()
    }, { rootMargin: "500px 0px" })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div ref={root} aria-label={isReady ? undefined : `Menyiapkan ${label}`}>{isReady ? children : <LoadingBlock />}</div>
}
