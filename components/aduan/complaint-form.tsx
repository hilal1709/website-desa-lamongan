"use client"

import type { FormEvent } from "react"
import { FileText, MapPin, MessageCircleMore, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import type { CmsSection } from "@/lib/cms-pages"

type ComplaintFormProps = {
  section?: CmsSection
  isSubmitting: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const fields = [
  { name: "title", icon: FileText, type: "text" },
  { name: "category", icon: MessageCircleMore, type: "text" },
  { name: "location", icon: MapPin, type: "text" },
  { name: "contact", icon: MessageCircleMore, type: "tel" },
] as const

export function ComplaintForm({ section, isSubmitting, onSubmit }: ComplaintFormProps) {
  const labels = section?.items ?? []

  return (
    <Card className="complaint-form-card overflow-hidden border-emerald-100 shadow-xl shadow-emerald-950/[0.06]">
      <CardHeader className="border-b border-slate-100 bg-white pb-5">
        <h2 id="complaint-form-title" className="text-xl font-black text-slate-950 sm:text-2xl">{section?.title ?? "Buat aduan"}</h2>
        <CardDescription>Informasi bertanda wajib diisi agar laporan dapat diproses.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-5 sm:p-7 sm:pt-7">
        <form aria-labelledby="complaint-form-title" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {fields.map(({ name, icon: Icon, type }, index) => {
              const label = labels[index]?.title ?? name
              return (
                <label key={name} className="complaint-field block text-sm font-bold text-slate-800">
                  <span className="flex items-center gap-2"><Icon aria-hidden size={15} className="text-emerald-700" />{label}</span>
                  <input required name={name} type={type} inputMode={type === "tel" ? "tel" : "text"} autoComplete={name === "contact" ? "tel" : "off"} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100" placeholder={`Masukkan ${label.toLowerCase()}`} />
                </label>
              )
            })}
          </div>

          <label className="complaint-field mt-4 block text-sm font-bold text-slate-800 sm:mt-5">
            <span className="flex items-center gap-2"><MessageCircleMore aria-hidden size={15} className="text-emerald-700" />{labels[4]?.title ?? "Ceritakan aduan Anda"}</span>
            <textarea required name="description" rows={5} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100" placeholder="Jelaskan kejadian, waktu, dan kondisi di lokasi." />
          </label>

          <div className="complaint-submit mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">Dengan mengirim, Anda menyetujui data digunakan untuk tindak lanjut aduan.</p>
            <Button type="submit" size="lg" className="w-full shrink-0 sm:w-auto" disabled={isSubmitting}><Send aria-hidden /> {isSubmitting ? "Mengirim..." : "Kirim aduan"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
