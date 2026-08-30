export const auditDateTime = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" })
export const auditFullDateTime = new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "medium" })

export function getAuditActionTone(action: string) {
  const value = action.toLowerCase()
  if (/(hapus|delete|revoke|gagal|failed)/.test(value)) return "bg-rose-50 text-rose-700 ring-rose-100"
  if (/(buat|create|tambah|publish|aktif)/.test(value)) return "bg-emerald-50 text-emerald-700 ring-emerald-100"
  if (/(ubah|update|edit|login)/.test(value)) return "bg-sky-50 text-sky-700 ring-sky-100"
  return "bg-slate-100 text-slate-700 ring-slate-200"
}

export function getAuditActorLabel(actorId: string | null) {
  return actorId ? `${actorId.slice(0, 8)}${actorId.length > 8 ? "…" : ""}` : "Sistem"
}
