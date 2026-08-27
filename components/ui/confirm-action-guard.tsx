"use client"

import { useLayoutEffect, useRef, useState, type MouseEvent } from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

export function ConfirmActionGuard({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<HTMLButtonElement | null>(null)
  const content = useRef<HTMLDivElement>(null)
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

  function intercept(event: MouseEvent<HTMLDivElement>) {
    if (bypass.current) return
    const button = (event.target as HTMLElement).closest("button")
    if (!button || button.disabled) return
    const label = `${button.getAttribute("aria-label") ?? ""} ${button.textContent ?? ""}`.trim()
    if (!/^hapus\b/i.test(label)) return
    event.preventDefault()
    event.stopPropagation()
    setTarget(button)
  }

  function confirm() {
    if (!target) return
    const nativeConfirm = window.confirm
    bypass.current = true
    window.confirm = () => true
    target.click()
    window.confirm = nativeConfirm
    bypass.current = false
    setTarget(null)
  }

  return <div onClickCapture={intercept}>{children}<Dialog open={Boolean(target)} onOpenChange={(open) => !open && setTarget(null)}><DialogContent className="max-w-md px-5"><div ref={content} className="rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl"><span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-700"><AlertTriangle className="size-6" /></span><DialogTitle className="mt-5 text-xl font-black text-slate-950">Hapus data?</DialogTitle><DialogDescription className="mt-2 text-sm leading-6 text-slate-600">Tindakan ini tidak dapat dibatalkan. Pastikan data yang dipilih memang ingin dihapus.</DialogDescription><div className="mt-6 flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setTarget(null)}>Batal</Button><Button type="button" className="bg-rose-700 hover:bg-rose-800" onClick={confirm}>Hapus</Button></div></div></DialogContent></Dialog></div>
}
