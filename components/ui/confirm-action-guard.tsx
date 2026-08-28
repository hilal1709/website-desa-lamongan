"use client"

import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert01Icon, CancelCircleIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

const AlertTriangle = ({ className }: { className?: string }) => <HugeiconsIcon icon={Alert01Icon} className={className} />
const CheckCircle2 = ({ className }: { className?: string }) => <HugeiconsIcon icon={CheckmarkCircle01Icon} className={className} />
const XCircle = ({ className }: { className?: string }) => <HugeiconsIcon icon={CancelCircleIcon} className={className} />

export function ConfirmActionGuard({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<HTMLButtonElement | null>(null)
  const [notification, setNotification] = useState<{ message: string; tone: "success" | "error" } | null>(null)
  const content = useRef<HTMLDivElement>(null)
  const notificationContent = useRef<HTMLDivElement>(null)
  const bypass = useRef(false)

  useLayoutEffect(() => {
    if (!target || !content.current) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined

    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !content.current) return
      context = gsap.context(() => {
        gsap.fromTo(content.current, { autoAlpha: 0, y: 18, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" })
      })
    })

    return () => { cancelled = true; context?.revert() }
  }, [target])

  useLayoutEffect(() => {
    if (!notification || !notificationContent.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled || !notificationContent.current) return
      context = gsap.context(() => {
        gsap.fromTo(notificationContent.current, { autoAlpha: 0, y: 16, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" })
      })
    })
    return () => { cancelled = true; context?.revert() }
  }, [notification])

  useEffect(() => {
    const show = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string; tone?: "success" | "error" }>).detail
      if (detail?.message) setNotification({ message: detail.message, tone: detail.tone === "error" ? "error" : "success" })
    }
    window.addEventListener("cms:notification", show)
    return () => window.removeEventListener("cms:notification", show)
  }, [])

  function intercept(event: MouseEvent<HTMLDivElement>) {
    if (bypass.current) return
    const button = (event.target as HTMLElement).closest("button")
    if (!button || button.disabled) return
    // The confirmation button itself also contains the word "Hapus". Do not
    // intercept it again, otherwise its action can never reach `confirm`.
    if (button.dataset.confirmAction === "true") return
    const label = `${button.getAttribute("aria-label") ?? ""} ${button.textContent ?? ""}`.trim()
    if (!/^hapus\b/i.test(label)) return
    event.preventDefault()
    event.stopPropagation()
    setTarget(button)
  }

  function confirm() {
    if (!target) return
    bypass.current = true
    document.documentElement.dataset.confirmedDelete = "true"
    target.click()
    delete document.documentElement.dataset.confirmedDelete
    bypass.current = false
    setTarget(null)
  }

  return <div onClickCapture={intercept}>{children}<Dialog open={Boolean(target)} onOpenChange={(open) => !open && setTarget(null)}><DialogContent className="max-w-md px-5"><div ref={content} className="rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl"><span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-700"><AlertTriangle className="size-6" /></span><DialogTitle className="mt-5 text-xl font-black text-slate-950">Hapus data?</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-slate-600">Tindakan ini tidak dapat dibatalkan. Pastikan data yang dipilih memang ingin dihapus.</DialogDescription><div className="mt-6 flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setTarget(null)}>Batal</Button><Button type="button" data-confirm-action="true" className="bg-rose-700 hover:bg-rose-800" onClick={confirm}>Hapus</Button></div></div></DialogContent></Dialog><Dialog open={Boolean(notification)} onOpenChange={(open) => !open && setNotification(null)}><DialogContent className="max-w-sm px-5"><div ref={notificationContent} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl"><span className={`grid size-12 place-items-center rounded-2xl ${notification?.tone === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{notification?.tone === "error" ? <XCircle className="size-6" /> : <CheckCircle2 className="size-6" />}</span><DialogTitle className="mt-5 text-xl font-black text-slate-950">{notification?.tone === "error" ? "Tindakan belum berhasil" : "Perubahan tersimpan"}</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-slate-600">{notification?.message}</DialogDescription><div className="mt-6 flex justify-end"><Button type="button" onClick={() => setNotification(null)}>Mengerti</Button></div></div></DialogContent></Dialog></div>
}
