"use client"

import { useLayoutEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { SecurityIcons } from "./icons"

export function SecurityNotificationDialog({ message, onClose }: { message: string; onClose: () => void }) {
  const content = useRef<HTMLDivElement>(null)
  const isSuccess = message.includes("aktif") || message.includes("disalin")
  const Icon = isSuccess ? SecurityIcons.check : SecurityIcons.error

  useLayoutEffect(() => {
    if (!message || !content.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !content.current) return
      context = gsap.context(() => gsap.fromTo(content.current, { autoAlpha: 0, scale: 0.92, y: 18 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.32, ease: "back.out(1.4)" }))
    })
    return () => { cancelled = true; context?.revert() }
  }, [message])

  return <Dialog open={Boolean(message)} onOpenChange={(open) => { if (!open) onClose() }}><DialogContent ref={content} className="w-[calc(100%-2rem)] max-w-sm px-0"><div className={cn("rounded-3xl border p-5 shadow-2xl sm:p-6", isSuccess ? "border-emerald-100 bg-emerald-50" : "border-rose-100 bg-rose-50")}><div className="flex items-start gap-3 sm:gap-4"><span className={cn("grid size-10 shrink-0 place-items-center rounded-2xl sm:size-11", isSuccess ? "bg-emerald-600 text-white" : "bg-rose-600 text-white")}><Icon className="size-5" /></span><div className="min-w-0"><DialogTitle className="text-base font-bold text-slate-950">{isSuccess ? "Berhasil diproses" : "Perlu perhatian"}</DialogTitle><DialogDescription className="mt-1 break-words leading-6 text-slate-600">{message}</DialogDescription></div></div><Button className="mt-5 w-full" variant={isSuccess ? "default" : "outline"} onClick={onClose}>Mengerti</Button></div></DialogContent></Dialog>
}
