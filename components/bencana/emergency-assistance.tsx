import Link from "next/link"
import {
  Sprout,
  PhoneCall,
  ExternalLink,
  FileText,
  Users,
  MessageSquare,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building2,
  HeartHandshake
} from "lucide-react"

export function EmergencyAssistance({ riskLevel }: { riskLevel: "aman" | "waspada" | "bahaya" }) {
  const serviceCards = [
    {
      title: "Surat Keterangan",
      description: "Pengantar, domisili, dan kebutuhan administrasi darurat lainnya.",
      href: "/layanan",
      icon: FileText,
      tone: "bg-emerald-50 text-emerald-700"
    },
    {
      title: "Layanan Kependudukan",
      description: "Informasi penggantian KTP, KK, dan berkas rusak pasca banjir.",
      href: "/layanan",
      icon: Users,
      tone: "bg-blue-50 text-blue-700"
    },
    {
      title: "Aduan Warga",
      description: "Sampaikan masalah tanggul jebol, saluran air, dan bantuan logistik.",
      href: "/aduan",
      icon: MessageSquare,
      tone: "bg-amber-50 text-amber-700 font-bold"
    },
    {
      title: "Peta & Data Desa",
      description: "Akses data terbuka demografi, wilayah, dan potensi Desa Kedungrejo.",
      href: "/infografis",
      icon: MapPin,
      tone: "bg-emerald-50 text-emerald-800"
    }
  ]

  return (
    <div className="space-y-12">
      {/* 1. BANTUAN DARURAT PETANI & WARGA (PROAKTIF FLOOD ASSISTANCE PANEL) */}
      <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl">
        <div className="p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-300 border border-emerald-400/30">
                <Sprout className="h-4 w-4 text-emerald-400" /> Bantuan Khusus Sektor Pertanian & Petani
              </span>
              <h3 className="text-2xl font-black sm:text-3xl text-white">
                Sawah Terendam & Butuh Bantuan Bibit Padi?
              </h3>
              <p className="text-sm leading-relaxed text-emerald-100/90">
                Jika lahan pertanian warga Desa Kedungrejo terdampak luapan banjir dan membutuhkan pasokan bibit padi pengganti,
                Pemerintah Desa berkoordinasi langsung dengan <b>Dinas Ketahanan Pangan dan Pertanian (Dinkpp) Kabupaten Lamongan</b>.
              </p>
            </div>

            {/* Quick Action Buttons for Farmers */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href="https://dinkpp.lamongankab.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                <span>Kontak Dinkpp Lamongan</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href="tel:0322321123"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-white/10 px-6 py-3.5 text-xs font-black text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <PhoneCall className="h-4 w-4 text-emerald-300" />
                <span>Call Center BPBD / Posko (0322) 321-123</span>
              </a>
            </div>
          </div>

          {/* Quick Step Cards for Affected Farmers */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3 border-t border-white/10 pt-6">
            <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">Langkah 1</div>
              <p className="mt-1 text-sm font-bold text-white">Foto & Catat Luas Sawah Terdampak</p>
              <p className="mt-1 text-xs text-emerald-200/80">Dokumentasikan kondisi tanaman padi yang rusak.</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">Langkah 2</div>
              <p className="mt-1 text-sm font-bold text-white">Lapor via Form Aduan Warga</p>
              <p className="mt-1 text-xs text-emerald-200/80">Data langsung disalurkan ke Gapoktan & Dinkpp.</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
              <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">Langkah 3</div>
              <p className="mt-1 text-sm font-bold text-white">Penyaluran Bantuan Bibit Subsidized</p>
              <p className="mt-1 text-xs text-emerald-200/80">Pengambilan bantuan di Balai Desa Kedungrejo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION LAYANAN UTAMA (STYLE MATCHING USER UPLOADED MOCKUP) */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800">LAYANAN DESA</span>
            <h2 className="mt-1 text-3xl font-black text-slate-900 tracking-tight">
              Akses layanan desa yang cepat dan jelas
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-xl font-medium">
              Berbagai kebutuhan warga dapat diselesaikan dengan proses yang lebih ringkas dan transparan.
            </p>
          </div>

          <Link
            href="/layanan"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950 hover:underline shrink-0"
          >
            <span>Lihat semua layanan</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid 4 Cards (Matching User Mockup) */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5"
              >
                <div>
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${card.tone}`}>
                    <Icon className="h-6 w-6" />
                  </span>

                  <h3 className="mt-5 text-lg font-extrabold text-slate-900 group-hover:text-emerald-800 transition">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-black text-emerald-800">
                  <span>Akses layanan</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
