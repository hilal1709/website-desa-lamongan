"use client"

import { CheckCircle2, XCircle } from "lucide-react"

export function Toast({ message, variant = "success" }: { message: string; variant?: "success" | "error" }) {
  const isSuccess = variant === "success"
  return <div role="status" className={`fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${isSuccess ? "bg-emerald-700" : "bg-rose-700"}`}>{isSuccess ? <CheckCircle2 size={19}/> : <XCircle size={19}/>}<span>{message}</span></div>
}
