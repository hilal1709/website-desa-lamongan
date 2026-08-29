"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon"
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon"
import FloppyDiskIcon from "@hugeicons/core-free-icons/FloppyDiskIcon"
import Delete01Icon from "@hugeicons/core-free-icons/Delete01Icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FooterLink, SiteRedirectRule, SiteSettings } from "@/lib/site-settings"

const Link2 = ({ className }: { className?: string }) => <HugeiconsIcon icon={Link01Icon} strokeWidth={1.8} className={className} aria-hidden="true" />
const Plus = ({ className }: { className?: string }) => <HugeiconsIcon icon={Add01Icon} strokeWidth={1.8} className={className} aria-hidden="true" />
const Save = ({ className }: { className?: string }) => <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={1.8} className={className} aria-hidden="true" />
const Trash2 = ({ className }: { className?: string }) => <HugeiconsIcon icon={Delete01Icon} strokeWidth={1.8} className={className} aria-hidden="true" />

export function FooterLinksManager({ initialSettings, initialRedirects }: { initialSettings: SiteSettings; initialRedirects: SiteRedirectRule[] }) {
  const [links, setLinks] = useState(initialSettings.footerLinks); const [saving, setSaving] = useState(false); const [message, setMessage] = useState("")
  const update = (index: number, key: keyof FooterLink, value: string) => setLinks((current) => current.map((link, itemIndex) => itemIndex === index ? { ...link, [key]: value } : link))
  const save = async () => { setSaving(true); setMessage(""); try { const response = await fetch("/api/admin/pengaturan", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...initialSettings, footerLinks: links, redirects: initialRedirects }) }); const payload = await response.json(); if (!response.ok) throw new Error(payload.message ?? "Link footer tidak dapat disimpan."); setLinks(payload.settings.footerLinks); window.localStorage.setItem("cms-public-updated", `${Date.now()}`); const notice = "Link footer berhasil disimpan."; setMessage(notice); window.dispatchEvent(new CustomEvent("cms:notice", { detail: { message: notice, variant: "success" } })) } catch (error) { const notice = error instanceof Error ? error.message : "Link footer tidak dapat disimpan."; setMessage(notice); window.dispatchEvent(new CustomEvent("cms:notice", { detail: { message: notice, variant: "error" } })) } finally { setSaving(false) } }
  return <Card data-settings-motion className="mt-5 overflow-hidden border-emerald-100 shadow-sm"><CardHeader className="flex-row items-start gap-3 space-y-0 sm:gap-4"><span data-settings-icon className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 sm:size-11"><Link2 className="size-5" /></span><div className="min-w-0"><CardTitle className="break-words text-base font-black">Link footer “Jelajahi”</CardTitle><CardDescription className="mt-1.5 break-words leading-6">Gunakan path internal seperti <strong>/aduan</strong>, bukan URL lengkap.</CardDescription></div></CardHeader><CardContent><div className="space-y-3">{links.map((link, index) => <div key={index} data-settings-row className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"><div><Label htmlFor={`footer-label-${index}`} className="text-xs">Label</Label><Input id={`footer-label-${index}`} value={link.label} onChange={(event) => update(index, "label", event.target.value)} className="mt-1.5" /></div><div><Label htmlFor={`footer-path-${index}`} className="text-xs">Tujuan (path)</Label><Input id={`footer-path-${index}`} value={link.href} onChange={(event) => update(index, "href", event.target.value)} placeholder="/profil" className="mt-1.5" /></div><Button type="button" variant="ghost" size="icon" aria-label={`Hapus link ${link.label || index + 1}`} onClick={() => setLinks((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="w-full text-rose-700 hover:bg-rose-50 hover:text-rose-800 md:w-10"><Trash2 /></Button></div>)}</div><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"><Button type="button" variant="outline" onClick={() => setLinks((current) => [...current, { label: "Link baru", href: "/" }])} className="w-full sm:w-auto"><Plus />Tambah link</Button><Button data-admin-action type="button" onClick={() => void save()} disabled={saving} className="w-full sm:w-auto"><Save />{saving ? "Menyimpan..." : "Simpan link footer"}</Button>{message ? <p className="text-center text-xs font-medium text-slate-500 sm:text-left">Notifikasi ditampilkan di popup.</p> : null}</div></CardContent></Card>
}
