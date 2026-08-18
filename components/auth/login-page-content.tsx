"use client"

import { useEffect, useRef } from "react"
import { KeyRound } from "lucide-react"

import { LoginBrand } from "@/components/auth/login-brand"
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent } from "@/components/ui/card"

export function LoginPageContent() {
  const root = useRef<HTMLElement>(null)
  const submitButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    let removeButtonListeners: (() => void) | undefined
    let idleHandle: number | undefined
    let usesIdleCallback = false

    const startAnimations = () => void import("gsap").then(({ default: gsap }) => {
      if (!root.current || cancelled) return

      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        const button = submitButton.current

        timeline
          .from(".login-card", { autoAlpha: 0, y: 34, scale: 0.97, duration: 0.75 })
          .from(".login-brand", { autoAlpha: 0, x: -28, duration: 0.62 }, "-=0.34")
          .from(".login-logo", { autoAlpha: 0, scale: 0.7, rotate: -12, duration: 0.55, ease: "back.out(1.7)" }, "-=0.34")
          .from(".login-copy", { autoAlpha: 0, y: 20, duration: 0.52, stagger: 0.09 }, "-=0.22")
          .from(".login-form-item", { autoAlpha: 0, x: 20, duration: 0.45, stagger: 0.1 }, "-=0.24")

        if (button) {
          timeline
            .from(button, { autoAlpha: 0, y: 14, scale: 0.96, duration: 0.42, ease: "back.out(1.35)" }, "-=0.08")
            .set(button, { clearProps: "opacity,visibility,transform" })
        }

        gsap.to(".login-orb-one", { x: 18, y: -16, duration: 4.2, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to(".login-orb-two", { x: -14, y: 18, duration: 4.8, repeat: -1, yoyo: true, ease: "sine.inOut" })
        gsap.to(".login-ring", { rotate: 18, scale: 1.06, duration: 5.5, repeat: -1, yoyo: true, ease: "sine.inOut" })

        if (button) {
          const enter = () => gsap.to(button, { y: -2, scale: 1.02, duration: 0.22, ease: "power2.out", overwrite: "auto" })
          const leave = () => gsap.to(button, { y: 0, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" })

          button.addEventListener("mouseenter", enter)
          button.addEventListener("mouseleave", leave)
          removeButtonListeners = () => {
            button.removeEventListener("mouseenter", enter)
            button.removeEventListener("mouseleave", leave)
          }
        }
      }, root)
    })

    const idleWindow = window as unknown as {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
      cancelIdleCallback?: (handle: number) => void
    }

    if (idleWindow.requestIdleCallback) {
      usesIdleCallback = true
      idleHandle = idleWindow.requestIdleCallback(startAnimations, { timeout: 900 })
    } else {
      idleHandle = window.setTimeout(startAnimations, 220)
    }

    return () => {
      cancelled = true
      if (idleHandle !== undefined) {
        if (usesIdleCallback) idleWindow.cancelIdleCallback?.(idleHandle)
        else clearTimeout(idleHandle)
      }
      removeButtonListeners?.()
      context?.revert()
    }
  }, [])

  return (
    <main ref={root} className="relative isolate min-h-[calc(100svh-88px)] overflow-hidden bg-[#f3f7f3] px-4 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-10 sm:pb-[calc(2.5rem+env(safe-area-inset-bottom))] lg:flex lg:min-h-[calc(100vh-88px)] lg:items-center lg:px-8 lg:py-12">
      <div className="login-orb-one absolute -left-24 top-12 -z-10 h-72 w-72 rounded-full bg-emerald-200/55 blur-3xl" />
      <div className="login-orb-two absolute -bottom-20 right-0 -z-10 h-80 w-80 rounded-full bg-teal-100/80 blur-3xl" />

      <Card className="login-card mx-auto grid w-full max-w-5xl overflow-hidden rounded-[26px] border-emerald-100 shadow-xl shadow-emerald-950/10 sm:rounded-[32px] lg:grid-cols-[1.05fr_0.95fr] lg:shadow-2xl">
        <LoginBrand />

        <section aria-labelledby="login-form-title">
        <CardContent className="p-6 pt-6 sm:p-10 sm:pt-10 lg:p-12 lg:pt-12">
          <div className="login-copy flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800"><KeyRound size={21} /></div>
          <p className="login-copy mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">CMS Admin</p>
          <h2 id="login-form-title" className="login-copy mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Selamat datang</h2>
          <LoginForm submitButtonRef={submitButton} />
        </CardContent>
        </section>
      </Card>
    </main>
  )
}
