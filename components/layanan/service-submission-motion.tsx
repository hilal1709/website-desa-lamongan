"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { CheckCircle2, CircleAlert, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

export function ServiceSubmissionMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    const cleanup: Array<() => void> = []
    void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return
      context = gsap.context(() => {
        gsap.from(".submission-intro", { autoAlpha: 0, x: -24, duration: 0.65, ease: "power3.out" })
        gsap.from(".submission-form-card", { autoAlpha: 0, y: 32, scale: 0.985, duration: 0.75, delay: 0.08, ease: "power3.out" })
        gsap.from(".submission-field", { autoAlpha: 0, y: 16, duration: 0.45, stagger: 0.07, delay: 0.2, ease: "power2.out" })
        // File inputs are critical controls: animate position only, never hide them.
        gsap.set(".submission-upload", { autoAlpha: 1 })
        gsap.from(".submission-upload", { x: 18, duration: 0.45, stagger: 0.07, delay: 0.38, ease: "power2.out" })
        gsap.to(".submission-orb", { y: -13, x: 8, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut" })
        const submit = root.current?.querySelector<HTMLElement>(".submission-submit")
        if (submit) { const enter = () => gsap.to(submit, { scale: 1.025, y: -2, duration: 0.2, overwrite: "auto" }); const leave = () => gsap.to(submit, { scale: 1, y: 0, duration: 0.3, overwrite: "auto" }); submit.addEventListener("mouseenter", enter); submit.addEventListener("mouseleave", leave); cleanup.push(() => { submit.removeEventListener("mouseenter", enter); submit.removeEventListener("mouseleave", leave) }) }
      }, root)
    })
    return () => { cancelled = true; cleanup.forEach((dispose) => dispose()); context?.revert() }
  }, [])
  useEffect(() => {
    const showNotification = (event: Event) => setNotification((event as CustomEvent<{ type: "success" | "error"; message: string }>).detail)
    window.addEventListener("service-notification", showNotification)
    return () => window.removeEventListener("service-notification", showNotification)
  }, [])
  return <div ref={root} className="relative overflow-hidden">{children}<SubmissionNotification notification={notification} onClose={() => setNotification(null)} /></div>
}

function SubmissionNotification({ notification, onClose }: { notification: { type: "success" | "error"; message: string } | null; onClose: () => void }) {
  const content = useRef<HTMLDivElement>(null)
  const success = notification?.type === "success"
  useEffect(() => {
    if (!notification || !content.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => { if (content.current) context = gsap.context(() => { gsap.fromTo(".submission-notification-overlay", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }); gsap.fromTo(".submission-notification-card", { autoAlpha: 0, y: 26, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.46, ease: "power3.out" }); gsap.from(".submission-notification-icon", { scale: 0.5, rotate: -18, duration: 0.45, delay: 0.1, ease: "back.out(1.7)" }) }, content) })
    return () => context?.revert()
  }, [notification])
  const Icon = success ? CheckCircle2 : CircleAlert
  return <Dialog open={Boolean(notification)} onOpenChange={(open) => { if (!open) onClose() }}><DialogContent ref={content} className="submission-notification-card max-w-md px-5 sm:px-0"><div className="submission-notification-overlay fixed inset-0 -z-10 bg-slate-950/80 backdrop-blur-md" /><div className={`relative rounded-3xl border bg-white p-6 shadow-2xl sm:p-8 ${success ? "border-emerald-200" : "border-rose-200"}`}><span className={`submission-notification-icon grid size-14 place-items-center rounded-2xl ${success ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}><Icon className="size-7" /></span><DialogClose aria-label="Tutup notifikasi" className="absolute right-5 top-5 grid size-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><X className="size-5" /></DialogClose><DialogTitle className="mt-5 text-2xl font-black text-slate-950">{success ? "Pengajuan terkirim" : "Pengajuan belum terkirim"}</DialogTitle><DialogDescription className="mt-3 text-sm leading-6 text-slate-600">{notification?.message}</DialogDescription><DialogClose asChild><Button variant={success ? "default" : "outline"} className="mt-6 w-full">{success ? "Baik, saya mengerti" : "Coba lagi"}</Button></DialogClose></div></DialogContent></Dialog>
}
