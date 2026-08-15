import Link from "next/link"
import { ArrowLeft, ShieldAlert } from "lucide-react"
import { AdminDisasterManager } from "@/components/bencana/admin-disaster-manager"

export const metadata = { title: "Kelola Status Bencana | Admin Kedungrejo" }

export default function AdminBencanaPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl space-y-7">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-950"
        >
          <ArrowLeft size={17} /> Kembali ke dashboard
        </Link>

        <header className="rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-800 p-8 text-white shadow-lg shadow-emerald-900/15 sm:p-9">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/15">
            <ShieldAlert size={24} />
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Kelola Bencana & Status Peta</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-100">
            Atur status peringatan darurat desa, verifikasi kondisi bencana di lapangan, dan kelola pengumuman cuaca untuk warga.
          </p>
        </header>

        <AdminDisasterManager />
      </div>
    </main>
  )
}
