"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Copy, KeyRound, LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Status = { enabled: boolean; enabledAt: string | null; enrollmentDeadline: string | null; configured: boolean }

async function call(body?: Record<string, string>) {
  const response = await fetch("/api/admin/mfa", body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : undefined)
  const data = await response.json() as Record<string, unknown>
  if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Permintaan gagal.")
  return data
}

export function MfaSecurityManager() {
  const router = useRouter()
  const [status, setStatus] = useState<Status | null>(null)
  const [setup, setSetup] = useState<{ secret: string; uri: string } | null>(null)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const load = () => call().then((data) => setStatus(data as unknown as Status)).catch((error: Error) => setMessage(error.message))
  useEffect(() => { load() }, [])
  const start = async () => { setBusy(true); setMessage(""); try { const data = await call({ action: "start" }); setSetup({ secret: String(data.secret), uri: String(data.uri) }); setPassword(""); setCode("") } catch (error) { setMessage(error instanceof Error ? error.message : "Gagal memulai MFA.") } finally { setBusy(false) } }
  const confirm = async () => { setBusy(true); setMessage(""); try { const data = await call({ action: "confirm", password, code }); setRecoveryCodes(Array.isArray(data.recoveryCodes) ? data.recoveryCodes.map(String) : []); setSetup(null); setPassword(""); setCode(""); setMessage("MFA aktif. Simpan recovery codes sebelum menutup halaman ini."); load() } catch (error) { setMessage(error instanceof Error ? error.message : "Aktivasi gagal.") } finally { setBusy(false) } }
  const disable = async () => { setBusy(true); setMessage(""); try { const data = await call({ action: "disable", password, code }); if (data.signedOut) router.push("/login") } catch (error) { setMessage(error instanceof Error ? error.message : "Penonaktifan gagal.") } finally { setBusy(false) } }

  return <Card className="max-w-2xl border-emerald-100 shadow-sm"><CardHeader><div className="flex items-start gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><ShieldCheck className="size-5" /></span><div><CardTitle>Multi-factor authentication</CardTitle><CardDescription className="mt-1">Hanya aplikasi authenticator yang menghasilkan kode TOTP enam digit. Jangan bagikan kode atau secret ini.</CardDescription></div></div></CardHeader><CardContent className="space-y-5">
    {!status ? <p className="flex items-center gap-2 text-sm text-slate-600"><LoaderCircle className="size-4 animate-spin" />Memeriksa status MFA…</p> : !status.configured ? <p className="flex gap-2 rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-900"><TriangleAlert className="size-5 shrink-0" />Server belum memiliki <code>MFA_ENCRYPTION_KEY</code>. Tambahkan key 32-byte base64 ke environment deployment sebelum mengaktifkan MFA.</p> : status.enabled ? <><div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900"><p className="flex items-center gap-2 font-bold"><CheckCircle2 className="size-5" />MFA aktif</p><p className="mt-1">Diaktifkan {status.enabledAt ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(status.enabledAt)) : ""}.</p></div>{recoveryCodes.length ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-bold">Simpan recovery codes ini sekarang.</p><p className="mt-1">Masing-masing hanya dapat digunakan sekali dan tidak akan ditampilkan lagi.</p><code className="mt-3 block whitespace-pre-wrap rounded-xl bg-white p-3">{recoveryCodes.join("\n")}</code><Button className="mt-3" size="sm" variant="outline" onClick={() => void navigator.clipboard.writeText(recoveryCodes.join("\n"))}><Copy />Salin kode</Button></div> : null}<div className="grid gap-4 sm:grid-cols-2"><label><Label htmlFor="disable-password">Kata sandi saat ini</Label><Input id="disable-password" className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label><label><Label htmlFor="disable-code">Kode authenticator</Label><Input id="disable-code" className="mt-2" inputMode="numeric" maxLength={14} value={code} onChange={(event) => setCode(event.target.value)} autoComplete="one-time-code" /></label></div><Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50" disabled={busy || !password || !code} onClick={() => void disable()}>{busy ? <LoaderCircle className="animate-spin" /> : <KeyRound />}Nonaktifkan MFA & keluar</Button></> : setup ? <><div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-950"><p className="font-bold">1. Tambahkan akun baru di aplikasi authenticator.</p><p className="mt-1">Masukkan setup key ini secara manual (jenis: Time-based, SHA-1, 6 digit, 30 detik):</p><div className="mt-3 flex items-center gap-2"><code className="min-w-0 flex-1 break-all rounded-xl bg-white p-3 font-bold">{setup.secret}</code><Button type="button" size="icon" variant="outline" aria-label="Salin setup key" onClick={() => void navigator.clipboard.writeText(setup.secret)}><Copy className="size-4" /></Button></div><a className="mt-3 inline-block text-xs font-semibold underline" href={setup.uri}>Buka tautan pengaturan authenticator</a></div><p className="text-sm text-slate-600">2. Masukkan kata sandi dan kode yang baru dihasilkan untuk menyelesaikan aktivasi. Sesi pengaturan berlaku 10 menit.</p><div className="grid gap-4 sm:grid-cols-2"><label><Label htmlFor="setup-password">Kata sandi saat ini</Label><Input id="setup-password" className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label><label><Label htmlFor="setup-code">Kode authenticator</Label><Input id="setup-code" className="mt-2" inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value)} autoComplete="one-time-code" /></label></div><div className="flex gap-2"><Button disabled={busy || !password || code.length !== 6} onClick={() => void confirm()}>{busy ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}Aktifkan MFA</Button><Button variant="outline" disabled={busy} onClick={() => setSetup(null)}>Batal</Button></div></> : <><p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">MFA belum aktif. Setelah tenggat enrolmen, akses admin akan dibatasi sampai MFA diaktifkan.{status.enrollmentDeadline ? ` Tenggat: ${new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(status.enrollmentDeadline))}.` : ""}</p><Button disabled={busy} onClick={() => void start()}>{busy ? <LoaderCircle className="animate-spin" /> : <ShieldCheck />}Atur MFA dengan authenticator</Button></>}
    {message && <p role="status" className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">{message}</p>}
  </CardContent></Card>
}
