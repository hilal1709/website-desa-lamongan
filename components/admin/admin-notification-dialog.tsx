"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { BellIcon, CancelIcon, ChevronRight } from "@/components/admin/dashboard-icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import type { AdminAttentionGroup } from "@/lib/admin-data"

export function AdminNotificationDialog({ attention }: { attention: AdminAttentionGroup[] }) {
  const notifications = attention.filter((group) => group.count > 0)
  const [open, setOpen] = useState(false)
  const content = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!notifications.length) return
    const timer = window.setTimeout(() => setOpen(true), 0)
    return () => window.clearTimeout(timer)
  }, [notifications.length])

  useEffect(() => {
    if (!open || !content.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !content.current) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo("[data-admin-notification-icon]", { autoAlpha: 0, scale: 0.72, rotate: -12 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.32 })
          .fromTo("[data-admin-notification-copy]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.34 }, "-=0.16")
          .fromTo("[data-admin-notification-item]", { autoAlpha: 0, x: 12 }, { autoAlpha: 1, x: 0, duration: 0.28, stagger: 0.07 }, "-=0.14")
      }, content)
    })
    return () => { cancelled = true; context?.revert() }
  }, [open])

  if (!notifications.length) return null

  return <Dialog open={open} onOpenChange={setOpen}><DialogContent ref={content} className="w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-amber-100 bg-white p-0 shadow-2xl"><div className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><span data-admin-notification-icon className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-800"><BellIcon className="size-6" /></span><DialogClose asChild><Button type="button" variant="ghost" size="icon" className="-mr-2 -mt-2 rounded-full" aria-label="Tutup notifikasi"><CancelIcon /></Button></DialogClose></div><div data-admin-notification-copy className="mt-5"><p className="text-xs font-black uppercase tracking-[.16em] text-amber-700">Perhatian operator</p><DialogTitle className="mt-2 text-2xl font-black text-slate-950">Ada yang perlu ditindaklanjuti</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-slate-600">Pilih notifikasi untuk membuka modul terkait dan memperbarui statusnya.</DialogDescription></div><div className="mt-5 space-y-2">{notifications.map((group) => <Link data-admin-notification-item key={group.key} href={group.href} onClick={() => setOpen(false)} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition hover:border-emerald-200 hover:bg-emerald-50"><span><b className="block text-sm text-slate-900">{group.label}</b><span className="mt-0.5 block text-xs text-slate-500">{group.description}</span></span><span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-sm font-black text-slate-900 shadow-sm">{group.count}<ChevronRight className="size-4 text-emerald-700" /></span></Link>)}</div><DialogClose asChild><Button type="button" variant="outline" className="mt-5 w-full">Nanti saja</Button></DialogClose></div></DialogContent></Dialog>
}
