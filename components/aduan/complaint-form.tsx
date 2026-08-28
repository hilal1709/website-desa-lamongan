"use client"


import { BrowserlessSelect } from "@/components/ui/select"
import { LegacyDatePicker } from "@/components/ui/date-picker"
import type { FormEvent } from "react"

import { ComplaintFileIcon, ComplaintLocationIcon, ComplaintMessageIcon, ComplaintSendIcon, ComplaintSparklesIcon } from "@/components/aduan/complaint-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { COMPLAINT_CATEGORIES } from "@/lib/complaint-categories"
import type { CmsSection } from "@/lib/cms-pages"

type ComplaintFormProps = {
  section?: CmsSection
  isSubmitting: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const fields = [
  { name: "title", icon: ComplaintFileIcon, type: "text" },
  { name: "category", icon: ComplaintMessageIcon, type: "select" },
  { name: "location", icon: ComplaintLocationIcon, type: "text" },
  { name: "contact", icon: ComplaintMessageIcon, type: "tel" },
] as const

export function ComplaintForm({ section, isSubmitting, onSubmit }: ComplaintFormProps) {
  const labels = section?.items ?? []

  return (
    <Card className="complaint-form-card min-w-0 overflow-hidden border-emerald-100 shadow-xl shadow-emerald-950/[0.06]">
      <CardHeader className="relative overflow-hidden border-b border-slate-100 bg-white p-4 pb-5 sm:p-5 sm:pb-5">
        <span aria-hidden className="complaint-header-glow absolute -right-8 -top-10 size-28 rounded-full bg-emerald-200/60 blur-2xl" />
        <div className="relative flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/15"><ComplaintSparklesIcon aria-hidden size={18} /></div>
          <div className="min-w-0">
            <h2 id="complaint-form-title" className="text-xl font-black text-slate-950 sm:text-2xl">{section?.title ?? "Buat aduan"}</h2>
            <CardDescription className="mt-1">Informasi bertanda wajib diisi agar laporan dapat diproses.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-5 sm:p-7 sm:pt-7">
        <form aria-describedby="complaint-form-description" aria-labelledby="complaint-form-title" onSubmit={onSubmit}>
          <p id="complaint-form-description" className="sr-only">Semua kolom pada formulir aduan wajib diisi.</p>
          <fieldset>
            <legend className="sr-only">Data laporan aduan</legend>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {fields.map(({ name, icon: Icon, type }, index) => {
                const label = labels[index]?.title ?? name
                return (
                  <div key={name} className="complaint-field group min-w-0 text-sm font-bold text-slate-800">
                    <Label htmlFor={`complaint-${name}`} className="flex items-center gap-2"><Icon aria-hidden size={15} className="text-emerald-700 transition-transform duration-200 group-focus-within:scale-110" />{label}</Label>
                    {type === "select" ? (
                      <BrowserlessSelect id={`complaint-${name}`} required name={name} defaultValue="" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-base font-normal text-slate-900 outline-none transition hover:border-emerald-200 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 sm:text-sm">
                        <option value="" disabled>Pilih kategori aduan</option>
                        {COMPLAINT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </BrowserlessSelect>
                    ) : (
                      <Input id={`complaint-${name}`} required name={name} type={type} inputMode={type === "tel" ? "tel" : "text"} autoComplete={name === "contact" ? "tel" : "off"} className="mt-2 text-base hover:border-emerald-200 sm:text-sm" placeholder={`Masukkan ${label.toLowerCase()}`} />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="complaint-field group mt-4 min-w-0 text-sm font-bold text-slate-800 sm:mt-5">
              <Label htmlFor="complaint-description" className="flex items-center gap-2"><ComplaintMessageIcon aria-hidden size={15} className="text-emerald-700 transition-transform duration-200 group-focus-within:scale-110" />{labels[4]?.title ?? "Ceritakan aduan Anda"}</Label>
              <Textarea id="complaint-description" required name="description" rows={5} className="mt-2 resize-y text-base hover:border-emerald-200 sm:text-sm" placeholder="Jelaskan kejadian, waktu, dan kondisi di lokasi." />
            </div>
          </fieldset>

          <div className="complaint-submit mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">Dengan mengirim, Anda menyetujui data digunakan untuk tindak lanjut aduan.</p>
            <Button type="submit" size="lg" className="complaint-send-button w-full shrink-0 shadow-lg shadow-emerald-900/15 sm:w-auto" disabled={isSubmitting}><ComplaintSendIcon aria-hidden className="complaint-send-icon" /> {isSubmitting ? "Mengirim..." : "Kirim aduan"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


