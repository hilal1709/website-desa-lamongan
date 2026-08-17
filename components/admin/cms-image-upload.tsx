"use client"

import { useState } from "react"
import { Check, Copy, ImageUp, LoaderCircle } from "lucide-react"

export function CmsImageUpload({ onUploaded }: { onUploaded?: (url: string) => void }) {
  const [url, setUrl] = useState("")
  const [message, setMessage] = useState("")
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setMessage("")
    const formData = new FormData()
    formData.append("image", file)
    const response = await fetch("/api/cms/uploads", { method: "POST", body: formData })
    const payload = await response.json() as { url?: string; message?: string }
    setUploading(false)
    if (!response.ok || !payload.url) return setMessage(payload.message ?? "Gambar gagal diunggah.")
    setUrl(payload.url)
    setMessage("Gambar siap digunakan.")
    onUploaded?.(payload.url)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setMessage("Link disalin.")
  }

  return <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4">
    <div className="flex flex-wrap items-center gap-3"><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"><ImageUp className="h-4 w-4" />{uploading ? "Mengunggah..." : "Unggah gambar"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" disabled={uploading} onChange={(event) => void upload(event.target.files?.[0])} /></label><p className="text-xs font-medium text-emerald-900">JPG, PNG, WebP, atau GIF · maks. 5 MB</p></div>
    {url ? <div className="mt-3 flex flex-wrap items-center gap-2"><code className="min-w-0 flex-1 break-all rounded-lg bg-white px-3 py-2 text-xs text-slate-700">{url}</code><button type="button" onClick={() => void copy()} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-800"><Copy className="h-3.5 w-3.5" />Salin link</button></div> : null}
    {message ? <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">{uploading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}{message}</p> : null}
  </div>
}
