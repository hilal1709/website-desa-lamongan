"use client"

import { useState, type FormEvent } from "react"
import { ShieldCheck } from "lucide-react"

import { ComplaintForm } from "@/components/aduan/complaint-form"
import { ComplaintHistory } from "@/components/aduan/complaint-history"
import { ComplaintMotion } from "@/components/aduan/complaint-motion"
import { Toast } from "@/components/ui/toast"
import type { ComplaintSummary } from "@/lib/complaints"
import type { CmsSection } from "@/lib/cms-pages"

type ComplaintPageContentProps = {
  formSection?: CmsSection
  historyTitle?: string
  complaints: ComplaintSummary[]
}

type SubmitResponse = { complaint?: ComplaintSummary; message?: string }

export function ComplaintPageContent({ formSection, historyTitle, complaints: initialComplaints }: ComplaintPageContentProps) {
  const [complaints, setComplaints] = useState(initialComplaints)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string; variant: "success" | "error" } | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/aduan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      const data = await response.json() as SubmitResponse

      if (!response.ok || !data.complaint) throw new Error(data.message ?? "Aduan belum dapat dikirim.")

      setComplaints((current) => [data.complaint!, ...current].slice(0, 8))
      form.reset()
      setMessage({ text: "Aduan berhasil dikirim dan menunggu tindak lanjut.", variant: "success" })
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Aduan belum dapat dikirim.", variant: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ComplaintMotion>
      <span aria-hidden className="complaint-orb absolute left-[8%] top-20 size-32 rounded-full bg-emerald-100/55 blur-3xl" />
      <span aria-hidden className="complaint-orb absolute right-[5%] top-52 size-44 rounded-full bg-lime-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <aside className="complaint-intro mb-7 flex max-w-2xl items-start gap-3 sm:mb-8 sm:gap-4" aria-label="Informasi privasi aduan">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><ShieldCheck aria-hidden size={22} /></div>
          <div>
            <p className="font-bold text-slate-900">Laporan Anda dikelola dengan aman</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Lengkapi informasi seperlunya agar petugas dapat menindaklanjuti aduan dengan tepat.</p>
          </div>
        </aside>

        <div className="grid items-start gap-7 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
          <ComplaintForm section={formSection} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
          <ComplaintHistory title={historyTitle} complaints={complaints} />
        </div>
      </div>
      {message && <Toast message={message.text} variant={message.variant} />}
    </ComplaintMotion>
  )
}
