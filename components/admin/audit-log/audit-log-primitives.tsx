"use client"

import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AuditIcon({ icon, className = "" }: { icon: Parameters<typeof HugeiconsIcon>[0]["icon"]; className?: string }) {
  return <HugeiconsIcon icon={icon} strokeWidth={1.8} className={className} aria-hidden="true" />
}

export function AuditEmptyState({ onReset }: { onReset: () => void }) {
  return <div className="px-5 py-14 text-center"><AuditIcon icon={Search01Icon} className="mx-auto size-8 text-slate-300" /><p className="mt-3 font-bold text-slate-700">Tidak ada catatan yang sesuai</p><p className="mt-1 text-sm text-slate-500">Ubah kata kunci atau filter resource untuk melihat catatan lain.</p><Button variant="outline" size="sm" className="mt-4" onClick={onReset}>Reset filter</Button></div>
}

export function AuditDetail({ label, children, mono = false }: { label: string; children: ReactNode; mono?: boolean }) {
  return <div className="rounded-xl bg-slate-50 p-3"><dt className="font-bold text-slate-500">{label}</dt><dd className={cn("mt-1 break-all text-slate-700", mono && "font-mono text-xs")}>{children}</dd></div>
}
