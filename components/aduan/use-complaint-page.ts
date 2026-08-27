"use client"

import { useState, type FormEvent } from "react"

import { COMPLAINT_PAGE_SIZE, type ComplaintPage, type ComplaintSummary } from "@/lib/complaint-types"

export type ComplaintNotice = { text: string; variant: "success" | "error" }

type SubmitResponse = { complaint?: ComplaintSummary; message?: string }

function normalizeComplaintPage(value: Partial<ComplaintPage> | null | undefined): ComplaintPage {
  const complaints = Array.isArray(value?.complaints) ? value.complaints : []
  const pageSize = typeof value?.pageSize === "number" && value.pageSize > 0 ? value.pageSize : COMPLAINT_PAGE_SIZE
  const totalItems = typeof value?.totalItems === "number" && value.totalItems >= 0 ? value.totalItems : complaints.length
  const totalPages = Math.max(1, typeof value?.totalPages === "number" && value.totalPages > 0 ? value.totalPages : Math.ceil(totalItems / pageSize))
  const page = Math.min(Math.max(typeof value?.page === "number" ? value.page : 1, 1), totalPages)
  return { complaints, page, pageSize, totalItems, totalPages }
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function useComplaintPage(initialPage: ComplaintPage) {
  const [complaintPage, setComplaintPage] = useState(() => normalizeComplaintPage(initialPage))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [notice, setNotice] = useState<ComplaintNotice | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setIsSubmitting(true)
    setNotice(null)

    try {
      const response = await fetch("/api/aduan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      const data = await response.json() as SubmitResponse
      if (!response.ok || !data.complaint) throw new Error(data.message ?? "Aduan belum dapat dikirim.")

      setComplaintPage((current) => ({
        ...current,
        page: 1,
        complaints: [data.complaint!, ...current.complaints].slice(0, current.pageSize),
        totalItems: current.totalItems + 1,
        totalPages: Math.max(1, Math.ceil((current.totalItems + 1) / current.pageSize)),
      }))
      form.reset()
      setNotice({ text: "Aduan berhasil dikirim dan menunggu tindak lanjut.", variant: "success" })
    } catch (error) {
      setNotice({ text: errorMessage(error, "Aduan belum dapat dikirim."), variant: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePageChange(nextPage: number) {
    if (nextPage < 1 || nextPage > complaintPage.totalPages || nextPage === complaintPage.page || isHistoryLoading) return
    setIsHistoryLoading(true)
    try {
      const response = await fetch(`/api/aduan?page=${nextPage}&pageSize=${COMPLAINT_PAGE_SIZE}`)
      if (!response.ok) throw new Error("Riwayat aduan belum dapat dimuat.")
      setComplaintPage(normalizeComplaintPage(await response.json() as ComplaintPage))
    } catch (error) {
      setNotice({ text: errorMessage(error, "Riwayat aduan belum dapat dimuat."), variant: "error" })
    } finally {
      setIsHistoryLoading(false)
    }
  }

  return { complaintPage, handlePageChange, handleSubmit, isHistoryLoading, isSubmitting, notice, dismissNotice: () => setNotice(null) }
}
