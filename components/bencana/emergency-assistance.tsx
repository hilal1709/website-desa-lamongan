import { DisasterExternalLinkIcon, DisasterPhoneIcon, DisasterSproutIcon } from "@/components/bencana/disaster-icons"
import type { CmsSection } from "@/lib/cms-pages"

const fallback = {
  eyebrow: "Bantuan Khusus Sektor Pertanian & Petani",
  title: "Sawah Terendam & Butuh Bantuan Bibit Padi?",
  description: "Jika lahan pertanian warga Desa Kedungrejo terdampak luapan banjir dan membutuhkan pasokan bibit padi pengganti, Pemerintah Desa berkoordinasi langsung dengan Dinas Ketahanan Pangan dan Pertanian (Dinkpp) Kabupaten Lamongan.",
  items: [{ title: "Kontak Dinkpp Lamongan", href: "https://dinkpp.lamongankab.go.id" }, { title: "Call Center BPBD / Posko (0322) 321 123", href: "tel:0322321123" }],
}

export function EmergencyAssistance({ content }: { content?: CmsSection }) {
  const eyebrow = content?.eyebrow?.trim() || fallback.eyebrow
  const title = content?.title?.trim() || fallback.title
  const description = content?.description?.trim() || fallback.description
  const actions = fallback.items.map((defaultItem, index) => ({ title: content?.items?.[index]?.title?.trim() || defaultItem.title, href: content?.items?.[index]?.href?.trim() || defaultItem.href }))
  return (
    <div>
      {/* 1. BANTUAN DARURAT PETANI & WARGA (PROAKTIF FLOOD ASSISTANCE PANEL) */}
      <section data-disaster-motion className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl">
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 space-y-3 lg:max-w-2xl">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-300 break-words">
                <DisasterSproutIcon className="h-4 w-4 text-emerald-400" /> {eyebrow}
              </span>
              <h3 className="text-xl font-black leading-tight text-white sm:text-3xl">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-emerald-100/90">
                {description}
              </p>
            </div>

            {/* Quick Action Buttons for Farmers */}
            <div className="flex w-full flex-col gap-3 lg:w-auto">
              <a
                href={actions[0].href}
                target={actions[0].href.startsWith("http") ? "_blank" : undefined}
                rel={actions[0].href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3.5 text-center text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 sm:px-6"
              >
                <span>{actions[0].title}</span>
                <DisasterExternalLinkIcon className="h-4 w-4" />
              </a>

              <a
                href={actions[1].href}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-white/10 px-4 py-3.5 text-center text-xs font-black text-white backdrop-blur-md transition hover:bg-white/20 sm:px-6"
              >
                <DisasterPhoneIcon className="h-4 w-4 text-emerald-300" />
                <span>{actions[1].title}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
