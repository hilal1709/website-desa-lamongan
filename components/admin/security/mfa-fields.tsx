"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type MfaFieldsProps = {
  prefix: "setup" | "disable"
  password: string
  code: string
  onPasswordChange: (value: string) => void
  onCodeChange: (value: string) => void
}

export function MfaFields({ prefix, password, code, onPasswordChange, onCodeChange }: MfaFieldsProps) {
  const isSetup = prefix === "setup"
  return <fieldset className="grid gap-4 sm:grid-cols-2"><legend className="sr-only">Verifikasi untuk {isSetup ? "aktivasi" : "menonaktifkan"} MFA</legend><div><Label htmlFor={`${prefix}-password`}>Kata sandi saat ini</Label><Input id={`${prefix}-password`} className="mt-2" type="password" value={password} onChange={(event) => onPasswordChange(event.target.value)} autoComplete="current-password" /></div><div><Label htmlFor={`${prefix}-code`}>Kode authenticator</Label><Input id={`${prefix}-code`} className="mt-2" inputMode="numeric" maxLength={isSetup ? 6 : 14} value={code} onChange={(event) => onCodeChange(event.target.value)} autoComplete="one-time-code" /></div></fieldset>
}
