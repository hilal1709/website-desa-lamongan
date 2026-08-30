"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MfaFields } from "./security/mfa-fields"
import { SecurityIcons } from "./security/icons"
import { SecurityNotificationDialog } from "./security/security-notification-dialog"
import { SecurityStatusCard } from "./security/security-status-card"
import type { MfaStatus } from "./security/types"

type Setup = { secret: string; uri: string }

async function requestMfa(body?: Record<string, string>) {
  const response = await fetch("/api/admin/mfa", body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : undefined)
  const data = await response.json() as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Permintaan gagal.")
  return data
}

const formatDate = (value: string | null, withTime = false) => value ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", ...(withTime ? { timeStyle: "short" } : {}) }).format(new Date(value)) : "Belum tersedia"

export function MfaSecurityManager({ initialStatus }: { initialStatus?: MfaStatus }) {
  const router = useRouter()
  const root = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<MfaStatus | null>(initialStatus ?? null)
  const [setup, setSetup] = useState<Setup | null>(null)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  const refreshStatus = () => requestMfa().then((data) => setStatus(data as unknown as MfaStatus)).catch((error: Error) => setMessage(error.message))

  useEffect(() => { if (!initialStatus) refreshStatus() }, [initialStatus])
  useSecurityEntranceAnimation(root)
  useSecurityPanelAnimation(root, status, setup)

  const start = async () => {
    setBusy(true); setMessage("")
    try {
      const data = await requestMfa({ action: "start" })
      setSetup({ secret: String(data.secret), uri: String(data.uri) })
      setPassword(""); setCode("")
    } catch (error) { setMessage(error instanceof Error ? error.message : "Gagal memulai MFA.") } finally { setBusy(false) }
  }

  const confirm = async () => {
    setBusy(true); setMessage("")
    try {
      const data = await requestMfa({ action: "confirm", password, code })
      setRecoveryCodes(Array.isArray(data.recoveryCodes) ? data.recoveryCodes.map(String) : [])
      setSetup(null); setPassword(""); setCode("")
      setMessage("MFA aktif. Simpan recovery codes sebelum menutup halaman ini.")
      refreshStatus()
    } catch (error) { setMessage(error instanceof Error ? error.message : "Aktivasi gagal.") } finally { setBusy(false) }
  }

  const disable = async () => {
    setBusy(true); setMessage("")
    try {
      const data = await requestMfa({ action: "disable", password, code })
      if (data.signedOut) router.push("/login")
    } catch (error) { setMessage(error instanceof Error ? error.message : "Penonaktifan gagal.") } finally { setBusy(false) }
  }

  const copy = async (value: string, successMessage: string) => { await navigator.clipboard.writeText(value); setMessage(successMessage) }
  const isProtected = Boolean(status?.enabled)
  const stateLabel = !status ? "Memeriksa" : !status.configured ? "Perlu konfigurasi" : isProtected ? "Terlindungi" : "Belum aktif"
  const Icon = SecurityIcons

  return <><section ref={root} aria-labelledby="mfa-manager-title" className="relative mx-auto mt-6 w-full max-w-6xl overflow-hidden rounded-[1.5rem] bg-slate-950 p-1 shadow-2xl shadow-emerald-950/10 sm:mt-8 sm:rounded-[2rem]">
    <div data-security-orbit aria-hidden className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full border border-emerald-400/20" />
    <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 size-64 rounded-full bg-emerald-500/10 blur-3xl" />
    <div className="relative rounded-[1.3rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/80 p-5 sm:rounded-[1.8rem] sm:p-8">
      <header data-security-hero className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"><Icon.shield className="size-7" /></span><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Pusat perlindungan</p><h2 id="mfa-manager-title" className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">Verifikasi dua langkah</h2></div></div>
        <p className={cn("inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-bold", isProtected ? "border-emerald-400/25 bg-emerald-400/15 text-emerald-200" : "border-amber-300/25 bg-amber-300/10 text-amber-100")}><span className={cn("size-1.5 rounded-full", isProtected ? "bg-emerald-300" : "bg-amber-300")} />{stateLabel}</p>
      </header>
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <Card data-security-card className="min-w-0 border-white/10 bg-white text-slate-950 shadow-xl shadow-black/10"><CardHeader className="border-b border-slate-100 pb-5"><CardTitle className="flex items-center gap-2"><Icon.lock className="size-4 text-emerald-700" />Pengaturan MFA</CardTitle><CardDescription>Gunakan aplikasi authenticator untuk menghasilkan kode TOTP enam digit. Jangan bagikan kode, secret, atau recovery code Anda.</CardDescription></CardHeader><CardContent className="pt-5"><MfaContent status={status} setup={setup} recoveryCodes={recoveryCodes} password={password} code={code} busy={busy} onPasswordChange={setPassword} onCodeChange={setCode} onStart={() => void start()} onConfirm={() => void confirm()} onDisable={() => void disable()} onCancel={() => setSetup(null)} onCopy={copy} /></CardContent></Card>
        <SecurityStatusCard status={status} />
      </div>
    </div>
  </section><SecurityNotificationDialog message={message} onClose={() => setMessage("")} /></>
}

type MfaContentProps = { status: MfaStatus | null; setup: Setup | null; recoveryCodes: string[]; password: string; code: string; busy: boolean; onPasswordChange: (value: string) => void; onCodeChange: (value: string) => void; onStart: () => void; onConfirm: () => void; onDisable: () => void; onCancel: () => void; onCopy: (value: string, message: string) => Promise<void> }

function MfaContent({ status, setup, recoveryCodes, password, code, busy, onPasswordChange, onCodeChange, onStart, onConfirm, onDisable, onCancel, onCopy }: MfaContentProps) {
  const Icon = SecurityIcons
  if (!status) return <p className="flex items-center gap-2 text-sm text-slate-600"><Icon.loading className="size-4 animate-spin text-emerald-700" />Memeriksa status keamanan…</p>
  if (!status.configured) return <div data-security-panel className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><Icon.alert className="mt-0.5 size-5 shrink-0" /><div><p className="font-bold">Kunci enkripsi belum tersedia</p><p className="mt-1 leading-6">Tambahkan <code className="rounded bg-amber-100 px-1 py-0.5">MFA_ENCRYPTION_KEY</code> (base64, 32-byte) ke environment deployment sebelum mengaktifkan MFA.</p></div></div>
  if (status.enabled) return <div data-security-panel className="space-y-5"><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-950"><p className="flex items-center gap-2 text-sm font-bold"><Icon.check className="size-5 text-emerald-700" />MFA aktif pada akun ini</p><p className="mt-1 text-sm">Diaktifkan {formatDate(status.enabledAt, true)}.</p></div>{recoveryCodes.length ? <RecoveryCodes codes={recoveryCodes} onCopy={onCopy} /> : null}<MfaFields prefix="disable" password={password} code={code} onPasswordChange={onPasswordChange} onCodeChange={onCodeChange} /><Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50" disabled={busy || !password || !code} onClick={onDisable}>{busy ? <Icon.loading className="animate-spin" /> : <Icon.key />}Nonaktifkan MFA & keluar</Button></div>
  if (setup) return <div data-security-panel className="space-y-5"><div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-950"><p className="font-bold">1. Tambahkan akun baru di aplikasi authenticator</p><p className="mt-1 leading-6">Masukkan setup key ini secara manual: Time-based, SHA-1, 6 digit, 30 detik.</p><div className="mt-3 flex items-center gap-2"><code className="min-w-0 flex-1 break-all rounded-xl border border-sky-100 bg-white p-3 font-bold">{setup.secret}</code><Button type="button" size="icon" variant="outline" aria-label="Salin setup key" onClick={() => void onCopy(setup.secret, "Setup key disalin ke clipboard.")}><Icon.copy className="size-4" /></Button></div><a className="mt-3 inline-block text-xs font-semibold underline underline-offset-4" href={setup.uri}>Buka tautan pengaturan authenticator</a></div><p className="text-sm leading-6 text-slate-600">2. Masukkan kata sandi dan kode baru dari aplikasi untuk menyelesaikan aktivasi. Sesi pengaturan berlaku 10 menit.</p><MfaFields prefix="setup" password={password} code={code} onPasswordChange={onPasswordChange} onCodeChange={onCodeChange} /><div className="flex flex-wrap gap-2"><Button disabled={busy || !password || code.length !== 6} onClick={onConfirm}>{busy ? <Icon.loading className="animate-spin" /> : <Icon.shield />}Aktifkan MFA</Button><Button variant="outline" disabled={busy} onClick={onCancel}>Batal</Button></div></div>
  return <div data-security-panel className="space-y-5"><p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">MFA belum aktif. Setelah tenggat enrolmen, akses admin akan dibatasi sampai MFA diaktifkan.{status.enrollmentDeadline ? ` Tenggat: ${formatDate(status.enrollmentDeadline)}.` : ""}</p><Button disabled={busy} size="lg" onClick={onStart}>{busy ? <Icon.loading className="animate-spin" /> : <Icon.shield />}Atur MFA dengan authenticator</Button></div>
}

function RecoveryCodes({ codes, onCopy }: { codes: string[]; onCopy: MfaContentProps["onCopy"] }) {
  const Icon = SecurityIcons
  return <section aria-labelledby="recovery-codes-title" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><h3 id="recovery-codes-title" className="font-bold">Simpan recovery codes ini sekarang.</h3><p className="mt-1 leading-6">Setiap kode hanya berlaku satu kali dan tidak ditampilkan kembali.</p><code className="mt-3 block whitespace-pre-wrap rounded-xl border border-amber-100 bg-white p-3 font-semibold leading-6">{codes.join("\n")}</code><Button className="mt-3" size="sm" variant="outline" onClick={() => void onCopy(codes.join("\n"), "Recovery codes disalin ke clipboard.")}><Icon.copy />Salin kode</Button></section>
}

function useSecurityEntranceAnimation(root: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined; let cancelled = false
    void import("gsap").then(({ default: gsap }) => { if (!cancelled && root.current) context = gsap.context(() => { gsap.from("[data-security-hero]", { autoAlpha: 0, y: 18, duration: 0.55, ease: "power3.out" }); gsap.from("[data-security-card]", { autoAlpha: 0, y: 22, scale: 0.985, duration: 0.6, stagger: 0.1, delay: 0.12, ease: "power3.out" }); gsap.to("[data-security-orbit]", { rotate: 360, duration: 20, repeat: -1, ease: "none" }) }, root) })
    return () => { cancelled = true; context?.revert() }
  }, [root])
}

function useSecurityPanelAnimation(root: React.RefObject<HTMLDivElement | null>, status: MfaStatus | null, setup: Setup | null) {
  useEffect(() => {
    if (!root.current || !status || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let context: ReturnType<typeof import("gsap").default.context> | undefined; let cancelled = false
    void import("gsap").then(({ default: gsap }) => { if (!cancelled && root.current) context = gsap.context(() => gsap.fromTo("[data-security-panel]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.38, ease: "power2.out" }), root) })
    return () => { cancelled = true; context?.revert() }
  }, [root, setup, status])
}
