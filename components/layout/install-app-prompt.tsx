"use client"

import { useEffect, useState } from "react"
import { Download, Share, X } from "lucide-react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallAppPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
    setIsStandalone(standalone)
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setInstallPrompt(null)
      setIsStandalone(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  async function installApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === "accepted") setIsStandalone(true)
    setInstallPrompt(null)
  }

  function dismissPrompt() {
    setIsDismissed(true)
  }

  if (isDismissed || isStandalone || (!installPrompt && !isIOS)) return null

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl shadow-slate-900/20 sm:left-auto" aria-label="Instal aplikasi Desa Kedungrejo">
      <div className="flex gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
          {isIOS ? <Share className="size-5" aria-hidden="true" /> : <Download className="size-5" aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">Instal Desa Kedungrejo</p>
          {isIOS ? (
            <p className="mt-1 text-sm leading-5 text-slate-600">Ketuk Bagikan, lalu pilih <span className="font-medium">Tambah ke Layar Utama</span>.</p>
          ) : (
            <p className="mt-1 text-sm leading-5 text-slate-600">Simpan sebagai aplikasi agar lebih mudah diakses dari layar utama.</p>
          )}
        </div>
        <button type="button" onClick={dismissPrompt} className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700" aria-label="Tutup pemberitahuan instalasi">
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      {!isIOS && (
        <button type="button" onClick={installApp} className="mt-3 w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
          Instal aplikasi
        </button>
      )}
    </aside>
  )
}
