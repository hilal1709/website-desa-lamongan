"use client"

import { useEffect, useRef } from "react"
import { AlertTriangle as CircleAlert, CheckCircle2, X } from "./infographic-icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

type Notice = { message: string; variant: "success" | "error" } | null

export function CmsNoticeDialog({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  const content = useRef<HTMLDivElement>(null)
  const success = notice?.variant === "success"
  useEffect(() => {
    if (!notice || !content.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined; let cancelled = false
    void import("gsap").then(({ default: gsap }) => { if (cancelled || !content.current) return; context = gsap.context(() => { gsap.timeline({ defaults: { ease: "power3.out" } }).fromTo("[data-cms-notice-icon]", { autoAlpha: 0, scale: .7, rotate: -12 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: .32 }).fromTo("[data-cms-notice-copy]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .34 }, "-=.15").fromTo("[data-cms-notice-action]", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .28 }, "-=.16") }, content) })
    return () => { cancelled = true; context?.revert() }
  }, [notice])
  return <Dialog open={Boolean(notice)} onOpenChange={(open) => { if (!open) onClose() }}><DialogContent ref={content} className="w-[calc(100%-2rem)] max-w-md rounded-3xl border border-emerald-100 bg-white p-0 shadow-2xl"><div className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><span data-cms-notice-icon className={`grid size-12 place-items-center rounded-2xl ${success ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{success ? <CheckCircle2 className="size-6" /> : <CircleAlert className="size-6" />}</span><DialogClose asChild><Button type="button" variant="ghost" size="icon" className="-mr-2 -mt-2 rounded-full" aria-label="Tutup notifikasi"><X className="size-5" /></Button></DialogClose></div><div data-cms-notice-copy className="mt-5"><p className={`text-xs font-black uppercase tracking-[.16em] ${success ? "text-emerald-700" : "text-red-700"}`}>{success ? "Berhasil diperbarui" : "Terjadi kendala"}</p><DialogTitle className="mt-2 text-2xl font-black text-slate-950">{success ? "Data tersimpan" : "Data belum diproses"}</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-slate-600">{notice?.message}</DialogDescription></div><div data-cms-notice-action className="mt-6"><DialogClose asChild><Button type="button" className="w-full">Mengerti</Button></DialogClose></div></div></DialogContent></Dialog>
}
