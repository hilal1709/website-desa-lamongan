import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-[#071b1d] text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-20 w-[57px] shrink-0 items-center justify-center">
                <Image
                  src="/images/logokedungrejo.png"
                  alt="Lambang Desa Kedungrejo"
                  width={57}
                  height={80}
                  className="h-auto w-full"
                />
              </div>
              <div>
                <p className="text-xl font-black text-white">Kedungrejo</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Desa digital</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              Mewujudkan pelayanan publik yang terbuka, tanggap, dan dekat dengan warga.
            </p>
          </div>

          <div>
            <p className="font-bold text-white">Jelajahi</p>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["Profil Desa", "/profil"],
                ["Berita Desa", "/berita"],
                ["Layanan Publik", "/layanan"],
                ["Data Desa", "/data-desa"],
              ].map(([label, href]) => (
                <Link className="block text-slate-300 transition hover:text-emerald-400" href={href} key={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-bold text-white">Kontak</p>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p className="flex gap-2"><MapPin size={16} className="mt-0.5 text-emerald-400" /> Jl. Raya Kedungrejo No. 01</p>
              <p className="flex gap-2"><Phone size={16} className="mt-0.5 text-emerald-400" /> (0333) 123456</p>
              <p className="flex gap-2"><Mail size={16} className="mt-0.5 text-emerald-400" /> desa@kedungrejo.id</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="font-bold text-white">Butuh bantuan?</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sampaikan laporan atau aspirasi Anda langsung ke pemerintah desa.
            </p>
            <Link href="/aduan" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-400">
              Buat aduan <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-slate-500">
        © 2025 Pemerintah Desa Kedungrejo. Hak cipta dilindungi.
      </div>
    </footer>
  )
}
