import { ShieldAlert } from "lucide-react"
import { AdminDisasterManager } from "@/components/bencana/admin-disaster-manager"

export const metadata = { title: "Kelola Status Bencana | Admin Kedungrejo" }

export default function AdminBencanaPage() {
  return (
    <section aria-labelledby="kelola-bencana-status-peta-title" className="min-h-screen bg-slate-50 px-1 py-4 sm:px-3 sm:py-8 lg:px-5 lg:py-10">
      <div className="mx-auto max-w-4xl space-y-5 sm:space-y-7">
        <header className="rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-800 p-5 text-white shadow-lg shadow-emerald-900/15 sm:p-9">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/15">
            <ShieldAlert size={24} aria-hidden="true" />
          </span>
          <h1 id="kelola-bencana-status-peta-title" className="mt-5 text-2xl font-bold tracking-tight sm:mt-6 sm:text-3xl">Kelola Bencana & Status Peta</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-100">
            Atur status peringatan darurat desa, verifikasi kondisi bencana di lapangan, dan kelola pengumuman cuaca untuk warga.
          </p>
        </header>

        <AdminDisasterManager />
      </div>
    </section>
  )
}
