import {
  Sprout,
  PhoneCall,
  ExternalLink,
} from "lucide-react"

export function EmergencyAssistance() {
  return (
    <div>
      {/* 1. BANTUAN DARURAT PETANI & WARGA (PROAKTIF FLOOD ASSISTANCE PANEL) */}
      <section data-disaster-motion className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl">
        <div className="p-5 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 space-y-3 lg:max-w-2xl">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
                <Sprout className="h-4 w-4 text-emerald-400" /> Bantuan Khusus Sektor Pertanian & Petani
              </span>
              <h3 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                Sawah Terendam & Butuh Bantuan Bibit Padi?
              </h3>
              <p className="text-sm leading-relaxed text-emerald-100/90">
                Jika lahan pertanian warga Desa Kedungrejo terdampak luapan banjir dan membutuhkan pasokan bibit padi pengganti,
                Pemerintah Desa berkoordinasi langsung dengan <b>Dinas Ketahanan Pangan dan Pertanian (Dinkpp) Kabupaten Lamongan</b>.
              </p>
            </div>

            {/* Quick Action Buttons for Farmers */}
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
              <a
                href="https://dinkpp.lamongankab.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3.5 text-center text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 sm:px-6"
              >
                <span>Kontak Dinkpp Lamongan</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href="tel:0322321123"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-white/10 px-4 py-3.5 text-center text-xs font-black text-white backdrop-blur-md transition hover:bg-white/20 sm:px-6"
              >
                <PhoneCall className="h-4 w-4 text-emerald-300" />
                <span>Call Center BPBD / Posko (0322) 321 123</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
