import Link from "next/link"
import {
  BarChart3,
  CalendarDays,
  ChevronRight,
  FileArchive,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { CmsPageEditor } from "@/components/admin/cms-page-editor"

const menu: { icon: LucideIcon; label: string; href: string; active?: boolean }[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
  { icon: Newspaper, label: "Konten halaman", href: "#konten-halaman" },
  { icon: FileText, label: "Antrian layanan", href: "#antrian-layanan" },
  { icon: MessageSquare, label: "Modul CMS", href: "#modul-cms" },
  { icon: BarChart3, label: "Infografis", href: "/admin/infografis" },
  { icon: FileArchive, label: "Ringkasan", href: "#ringkasan-cms" },
  { icon: Settings, label: "Pengaturan", href: "#status-sistem" },
]

const stats: { icon: LucideIcon; value: string; label: string; change: string }[] = [
  { icon: FileText, value: "248", label: "Pengajuan layanan", change: "+12%" },
  { icon: MessageSquare, value: "12", label: "Aduan aktif", change: "4 prioritas" },
  { icon: Users, value: "4.862", label: "Warga terdata", change: "100%" },
  { icon: Newspaper, value: "18", label: "Konten publik", change: "6 draft" },
]

const queue = [
  { title: "Surat Keterangan Domisili", meta: "Ahmad Fauzi · RT 04 · 10 menit lalu", status: "Baru" },
  { title: "Aduan jalan berlubang", meta: "Infrastruktur · Dusun Krajan", status: "Diproses" },
  { title: "Update data pendidikan", meta: "Infografis · Dusun Timur", status: "Review" },
  { title: "Artikel posyandu balita", meta: "Berita desa · Draft admin", status: "Draft" },
]

const modules = [
  { title: "Kelola Infografis", description: "Input data penduduk dan statistik desa.", href: "/admin/infografis", icon: BarChart3 },
  { title: "Review Aduan", description: "Pantau laporan dan status tindak lanjut.", href: "/aduan", icon: MessageSquare },
  { title: "Publikasi Berita", description: "Kelola kabar dan pengumuman desa.", href: "/berita", icon: Newspaper },
]

const schedules = ["Verifikasi surat masuk", "Rekap aduan mingguan", "Cek data infografis", "Publikasi pengumuman"]

export const metadata = { title: "CMS Admin | Kedungrejo" }

export default function Admin() {
  return (
    <section className="min-h-screen bg-[#eef5ef] px-4 pb-8 pt-4 lg:px-6">
      <div className="mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-24 hidden h-[calc(100vh-120px)] rounded-[28px] border border-emerald-900/10 bg-slate-950 p-4 text-white shadow-xl shadow-emerald-950/10 lg:block">
          <Link href="/" className="flex items-center gap-3 rounded-2xl bg-white/6 p-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400 text-slate-950">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>
              <b className="block text-sm font-black uppercase tracking-[0.16em]">CMS Desa</b>
              <small className="text-slate-400">Kedungrejo</small>
            </span>
          </Link>

          <nav className="mt-6 space-y-1">
            {menu.map(({ icon: Icon, label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-bold transition ${
                  active ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                {active ? <ChevronRight className="h-4 w-4" /> : null}
              </Link>
            ))}
          </nav>

          <div className="absolute inset-x-4 bottom-4 rounded-3xl border border-white/10 bg-white/6 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Status sistem</p>
            <p className="mt-2 text-sm font-semibold text-white">Semua modul aktif</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Data publik siap diperbarui oleh operator desa.</p>
          </div>
        </aside>

        <main className="min-w-0" suppressHydrationWarning>
          <div className="px-1 py-2">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Dashboard CMS</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Kelola konten dan layanan desa.
            </h1>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ icon: Icon, value, label, change }) => (
              <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{change}</span>
                </div>
                <p className="mt-5 text-3xl font-black text-slate-950">{value}</p>
                <p className="mt-1 text-sm font-bold text-slate-600">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <CmsPageEditor />

              <section id="antrian-layanan" className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Antrian kerja</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-950">Butuh perhatian operator</h2>
                  </div>
                  <Link href="/layanan" className="text-sm font-bold text-emerald-700">
                    Lihat semua
                  </Link>
                </div>
                <div className="mt-5">
                  <DataTable rows={queue} />
                </div>
              </section>

              <section id="modul-cms" className="grid gap-4 md:grid-cols-3">
                {modules.map(({ icon: Icon, title, description, href }) => (
                  <Link key={title} href={href} className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 font-black text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-emerald-700">
                      Buka modul <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </section>
            </div>

            <aside className="space-y-5">
              <section id="ringkasan-cms" className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
                    <CalendarDays className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Hari ini</p>
                    <h2 className="font-black text-slate-950">Agenda CMS</h2>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {schedules.map((item, index) => (
                    <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-xs font-black text-emerald-800 shadow-sm">
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="status-sistem" className="rounded-[28px] border border-emerald-900/10 bg-slate-950 p-5 text-white shadow-lg">
                <BarChart3 className="h-6 w-6 text-emerald-300" />
                <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-emerald-300">Ringkasan</p>
                <h2 className="mt-2 text-2xl font-black">96% layanan selesai</h2>
                <div className="mt-5 space-y-4">
                  {[
                    ["Surat", 84],
                    ["Aduan", 58],
                    ["Berita", 72],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="mb-2 flex justify-between text-sm font-semibold text-slate-300">
                        <span>{label}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-emerald-300" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </section>
  )
}
