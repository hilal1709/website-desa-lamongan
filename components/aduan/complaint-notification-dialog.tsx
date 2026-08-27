"use client"

import { useLayoutEffect, useRef } from "react"

import { ComplaintAlertIcon, ComplaintCheckIcon, ComplaintCloseIcon } from "@/components/aduan/complaint-icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

type ComplaintNotificationDialogProps = {
  message: { text: string; variant: "success" | "error" } | null
  onOpenChange: (open: boolean) => void
}

export function ComplaintNotificationDialog({ message, onOpenChange }: ComplaintNotificationDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const isSuccess = message?.variant === "success"

  useLayoutEffect(() => {
    if (!message || !contentRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !contentRef.current) return
      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline
          .fromTo(contentRef.current, { autoAlpha: 0, y: 28, scale: 0.92, rotate: -1 }, { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.42 })
          .from(".complaint-notification-icon", { autoAlpha: 0, scale: 0.35, rotate: -18, duration: 0.38, ease: "back.out(2)" }, "-=0.18")
          .from(".complaint-notification-copy", { autoAlpha: 0, y: 12, duration: 0.32 }, "-=0.16")
          .from(".complaint-notification-button", { autoAlpha: 0, y: 10, duration: 0.28 }, "-=0.1")
        gsap.to(".complaint-notification-ring", { scale: 1.18, opacity: 0, duration: 1.5, repeat: -1, ease: "power1.out" })
      }, contentRef)
    })

    return () => { cancelled = true; context?.revert() }
  }, [message])

  return (
    <Dialog open={Boolean(message)} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md px-0">
        <div ref={contentRef} className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-emerald-100 bg-white p-5 shadow-2xl shadow-slate-950/25 sm:p-7">
          <div aria-hidden className={`absolute -right-12 -top-14 size-36 rounded-full blur-3xl ${isSuccess ? "bg-emerald-200/70" : "bg-rose-200/70"}`} />
          <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-3 text-slate-500 hover:text-slate-950" onClick={() => onOpenChange(false)} aria-label="Tutup notifikasi"><ComplaintCloseIcon aria-hidden /></Button>
          <div className="relative">
            <span className={`complaint-notification-icon relative grid size-14 place-items-center rounded-2xl ${isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
              <span aria-hidden className={`complaint-notification-ring absolute inset-0 rounded-2xl border-2 ${isSuccess ? "border-emerald-400" : "border-rose-400"}`} />
              {isSuccess ? <ComplaintCheckIcon aria-hidden size={29} /> : <ComplaintAlertIcon aria-hidden size={29} />}
            </span>
            <div className="complaint-notification-copy mt-5">
              <DialogTitle className="text-xl font-black text-slate-950">{isSuccess ? "Aduan berhasil dikirim" : "Aduan belum terkirim"}</DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-slate-600">{message?.text}</DialogDescription>
            </div>
            <Button type="button" className={`complaint-notification-button mt-6 w-full ${isSuccess ? "" : "bg-rose-700 hover:bg-rose-800"}`} onClick={() => onOpenChange(false)}>{isSuccess ? "Baik, saya mengerti" : "Coba lagi"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
