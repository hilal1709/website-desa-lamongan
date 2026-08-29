"use client"

import { useCallback, useState } from "react"

import type { ServiceSubmission, VillageService, ServiceDraft } from "./service-types"
import { isSavedService } from "./service-types"

export function useServiceManagerData(initialServices: VillageService[], initialSubmissions: ServiceSubmission[]) {
  const [services, setServices] = useState(initialServices)
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const refresh = useCallback(async () => {
    const [catalogResponse, submissionsResponse] = await Promise.all([fetch("/api/cms/layanan/katalog"), fetch("/api/cms/layanan/pengajuan")])
    const [catalog, queue] = await Promise.all([catalogResponse.json(), submissionsResponse.json()])
    setServices(catalog.services ?? [])
    setSubmissions(queue.submissions ?? [])
  }, [])

  const saveService = useCallback(async (service: VillageService | ServiceDraft) => {
    setSaving(true)
    try {
      const response = await fetch("/api/cms/layanan/katalog", { method: isSavedService(service) ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(service) })
      const data = await response.json()
      setMessage(response.ok ? "Katalog layanan berhasil disimpan." : data.message)
      if (response.ok) await refresh()
      return response.ok
    } catch { setMessage("Katalog belum tersimpan. Coba lagi."); return false } finally { setSaving(false) }
  }, [refresh])

  const saveSubmissionStatus = useCallback(async (id: string, form: HTMLFormElement) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/cms/layanan/pengajuan/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) })
      const data = await response.json()
      setMessage(response.ok ? "Status pengajuan berhasil diperbarui." : data.message)
      if (response.ok) await refresh()
    } catch { setMessage("Status belum diperbarui. Coba lagi.") } finally { setSaving(false) }
  }, [refresh])

  const deleteSubmission = useCallback(async (id: string) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/cms/layanan/pengajuan/${id}`, { method: "DELETE" })
      const data = response.status === 204 ? null : await response.json()
      setMessage(response.ok ? "Pengajuan berhasil dihapus." : data?.message ?? "Pengajuan tidak dapat dihapus.")
      if (response.ok) await refresh()
      return response.ok
    } catch { setMessage("Pengajuan tidak dapat dihapus."); return false } finally { setSaving(false) }
  }, [refresh])

  const deleteService = useCallback(async (id: string) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/cms/layanan/katalog?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      const data = response.status === 204 ? null : await response.json()
      setMessage(response.ok ? "Layanan berhasil dihapus." : data?.message ?? "Layanan tidak dapat dihapus.")
      if (response.ok) await refresh()
      return response.ok
    } catch { setMessage("Layanan tidak dapat dihapus."); return false } finally { setSaving(false) }
  }, [refresh])

  return { services, submissions, saving, message, setMessage, saveService, saveSubmissionStatus, deleteSubmission, deleteService }
}
