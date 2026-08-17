"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

export function ChartViewport({ children, className = "min-h-56 sm:min-h-72" }: { children: ReactNode; className?: string }) {
  const element = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = element.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setVisible(true)
      observer.disconnect()
    }, { rootMargin: "280px 0px" })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return <div ref={element} className={className}>{visible ? children : <div className="min-h-56 animate-pulse rounded-2xl bg-slate-100 sm:min-h-72" />}</div>
}
