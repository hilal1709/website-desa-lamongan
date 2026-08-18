"use client"

import { useActionState, type RefObject } from "react"
import { LoaderCircle, LockKeyhole, UserRound } from "lucide-react"

import { loginAdmin, type LoginState } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialLoginState: LoginState = {}

export function LoginForm({ submitButtonRef }: { submitButtonRef: RefObject<HTMLButtonElement | null> }) {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialLoginState)

  return (
    <form className="mt-7 space-y-5" aria-label="Form login CMS admin" action={formAction} noValidate={false}>
      <div className="login-form-item space-y-2">
        <Label htmlFor="username">Username atau email</Label>
        <div className="relative">
          <UserRound aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input id="username" name="username" type="text" autoComplete="username" placeholder="Masukkan username atau email" className="pl-11" required />
        </div>
      </div>

      <div className="login-form-item space-y-2">
        <Label htmlFor="password">Kata sandi</Label>
        <div className="relative">
          <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="Masukkan kata sandi" className="pl-11" required />
        </div>
      </div>

      {state.error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{state.error}</p>}
      <Button ref={submitButtonRef} type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
        {isPending ? <><LoaderCircle className="animate-spin" aria-hidden="true" /> Memeriksa akun...</> : "Masuk ke CMS"}
      </Button>
    </form>
  )
}
