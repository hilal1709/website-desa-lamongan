import Link from "next/link"
import { PageHero } from "@/components/ui/page-hero"
import { CheckCircle2, FileUp, Send } from "lucide-react"
import { getCmsPage } from "@/lib/cms-pages"

export const dynamic = "force-dynamic"

export default async function LayananDigital() {
  const hero = await getCmsPage("layanan-digital")

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={hero.image}
        imagePosition={hero.imagePosition}
      />

      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 lg:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Form Pengajuan Surat</h2>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {["Nama lengkap", "NIK", "Nomor WhatsApp", "Jenis surat"].map((label) => (
              <label key={label} className="block text-sm font-bold text-slate-700">
                {label}
                <input
                  type="text"
                  placeholder=""
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition hover:border-slate-300 focus:border-green-800 focus:bg-white"
                />
              </label>
            ))}
          </div>

          <label className="mt-5 block text-sm font-bold text-slate-700">
            Keperluan
            <textarea
              placeholder=""
              rows={5}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition hover:border-slate-300 focus:border-green-800 focus:bg-white"
            />
          </label>

          <button className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-800 px-5 py-3 font-bold text-white transition hover:bg-green-900">
            <Send size={17} /> Kirim pengajuan
          </button>
        </div>

        <aside>
          <h2 className="text-xl font-bold text-slate-900">Sebelum mengajukan</h2>
          <div className="mt-5 space-y-4">
            {[
              { icon: CheckCircle2, text: "Data diri sesuai KTP" },
              { icon: FileUp, text: "Dokumen pendukung siap" },
              { icon: CheckCircle2, text: "Nomor kontak aktif" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                <Icon size={19} className="shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}
