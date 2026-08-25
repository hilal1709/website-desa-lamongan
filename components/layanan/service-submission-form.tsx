"use client"

import { useState, type FormEvent } from "react"
import { Send } from "lucide-react"
import type { ServiceCatalogItem } from "@/lib/village-services"

export function ServiceSubmissionForm({ service }: { service: ServiceCatalogItem }) {
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage("")
    const response = await fetch("/api/layanan/pengajuan", { method: "POST", body: new FormData(event.currentTarget) }); const data = await response.json()
    setSaving(false); if (!response.ok) return setMessage(data.message ?? "Pengajuan belum dapat dikirim.")
    event.currentTarget.reset(); setMessage(`Pengajuan berhasil dikirim. Simpan kode lacak Anda: ${data.trackingCode}`)
  }
  return <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"><input type="hidden" name="serviceId" value={service.id} /><div className="grid gap-4 sm:grid-cols-2">{[["fullName", "Nama lengkap", "text"], ["nationalId", "NIK (16 digit)", "text"], ["whatsapp", "Nomor WhatsApp", "tel"]].map(([name, label, type]) => <label key={name} className="text-sm font-bold text-slate-700">{label}<input required name={name} type={type} inputMode={name === "nationalId" ? "numeric" : undefined} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal" /></label>)}<label className="sm:col-span-2 text-sm font-bold text-slate-700">Alamat sesuai KTP<textarea required name="address" rows={3} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-normal" /></label><label className="sm:col-span-2 text-sm font-bold text-slate-700">Keperluan<textarea required name="purpose" rows={3} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-normal" /></label></div><div className="mt-6 border-t border-slate-100 pt-5"><h2 className="font-black text-slate-950">Unggah persyaratan</h2><p className="mt-1 text-sm text-slate-500">PDF, JPG, PNG, atau WebP; maksimal 5 MB tiap berkas.</p><div className="mt-4 space-y-3">{service.requirements.map((item) => <label key={item.id} className="block rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{item.title}{item.isRequired ? " *" : " (opsional)"}<input name="attachments" required={item.isRequired} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="mt-2 block w-full text-xs font-normal" /></label>)}</div></div><button disabled={saving} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white disabled:opacity-50"><Send className="size-4" />{saving ? "Mengirim..." : "Kirim pengajuan"}</button>{message && <p aria-live="polite" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900">{message}</p>}</form>
}
