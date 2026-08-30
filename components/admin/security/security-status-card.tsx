import { cn } from "@/lib/utils"
import { SecurityIcons } from "./icons"
import type { MfaStatus } from "./types"

export function SecurityStatusCard({ status }: { status: MfaStatus | null }) {
  const secure = Boolean(status?.enabled)
  const StatusIcon = SecurityIcons.status
  const KeyIcon = SecurityIcons.key
  return <aside aria-labelledby="security-status-title" data-security-card className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-slate-200 backdrop-blur-sm"><p id="security-status-title" className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Status perlindungan</p><div className="mt-5 space-y-5"><div><div className="flex items-center justify-between gap-3 text-sm"><span>Verifikasi dua langkah</span><span className="shrink-0 font-bold text-white">{secure ? "Aktif" : "Tertunda"}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={cn("h-full rounded-full transition-all duration-700", secure ? "w-full bg-emerald-400" : "w-1/2 bg-amber-300")} /></div></div><dl className="space-y-3 border-y border-white/10 py-5"><StatusItem icon={StatusIcon} label="Authenticator" value={secure ? "Terhubung" : "Belum diatur"} /><StatusItem icon={KeyIcon} label="Recovery code" value={secure ? "Tersedia" : "Setelah aktivasi"} /></dl><p className="rounded-2xl bg-emerald-400/10 p-3 text-xs leading-5 text-emerald-50">Aplikasi authenticator tidak menerima kata sandi akun Anda; ia hanya membuat kode sementara.</p></div></aside>
}

function StatusItem({ icon: Icon, label, value }: { icon: typeof SecurityIcons.status; label: string; value: string }) {
  return <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-white/10 text-emerald-300"><Icon className="size-4" /></span><div><dt className="text-xs text-slate-400">{label}</dt><dd className="text-sm font-semibold text-white">{value}</dd></div></div>
}
