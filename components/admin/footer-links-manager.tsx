"use client"

import { useState } from "react"
import { Link2, Plus, Save, Trash2 } from "lucide-react"
import type { FooterLink, SiteRedirectRule, SiteSettings } from "@/lib/site-settings"

const inputClass = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-700 focus:bg-white"

export function FooterLinksManager({ initialSettings, initialRedirects }: { initialSettings: SiteSettings; initialRedirects: SiteRedirectRule[] }) {
  const [links, setLinks] = useState(initialSettings.footerLinks)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const update = (index: number, key: keyof FooterLink, value: string) => setLinks((current) => current.map((link, itemIndex) => itemIndex === index ? { ...link, [key]: value } : link))
  const save = async () => {
    setSaving(true); setMessage("")
    try {
      const response = await fetch("/api/admin/pengaturan", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...initialSettings, footerLinks: links, redirects: initialRedirects }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message ?? "Link footer tidak dapat disimpan.")
      setLinks(payload.settings.footerLinks); window.localStorage.setItem("cms-public-updated", `${Date.now()}`); setMessage("Link footer berhasil disimpan.")
    } catch (error) { setMessage(error instanceof Error ? error.message : "Link footer tidak dapat disimpan.") } finally { setSaving(false) }
  }
  return <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex gap-3"><Link2 className="size-6 text-emerald-700" /><div><h2 className="font-black text-slate-950">Link footer “Jelajahi”</h2><p className="mt-1 text-sm text-slate-500">Gunakan path internal seperti <span className="font-bold">/aduan</span>, bukan URL lengkap.</p></div></div><div className="mt-5 space-y-3">{links.map((link, index) => <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"><label className="text-sm font-bold text-slate-700">Label<input value={link.label} onChange={(event) => update(index, "label", event.target.value)} className={inputClass} /></label><label className="text-sm font-bold text-slate-700">Tujuan (path)<input value={link.href} onChange={(event) => update(index, "href", event.target.value)} placeholder="/profil" className={inputClass} /></label><button type="button" onClick={() => setLinks((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold text-rose-700 hover:bg-rose-50"><Trash2 className="size-4" />Hapus</button></div>)}</div><div className="mt-5 flex flex-wrap items-center gap-3"><button type="button" onClick={() => setLinks((current) => [...current, { label: "Link baru", href: "/" }])} className="inline-flex h-11 items-center gap-2 rounded-xl border border-emerald-200 px-4 text-sm font-bold text-emerald-800"><Plus className="size-4" />Tambah link</button><button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white disabled:opacity-60"><Save className="size-4" />{saving ? "Menyimpan..." : "Simpan link footer"}</button>{message ? <p role="status" className="text-sm font-semibold text-emerald-700">{message}</p> : null}</div></section>
}
