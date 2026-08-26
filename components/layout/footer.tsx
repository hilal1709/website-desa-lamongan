import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"
import type { SiteSettings } from "@/lib/site-settings"

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-[#071b1d] text-slate-300">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="inline-flex items-center gap-3">
              <div className="flex h-20 w-[57px] shrink-0 items-center justify-center">
                <Image
                  src="/images/logokedungrejo.png"
                  alt={`Lambang ${settings.villageName}`}
                  width={57}
                  height={80}
                  className="h-auto w-full"
                />
              </div>
              <div>
                <p className="text-xl font-black text-white">{settings.villageName.replace(/^Desa\s+/i, "")}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{settings.regency || "Desa digital"}</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              {settings.tagline}
            </p>
          </div>

          <div>
            <p className="font-bold text-white">Jelajahi</p>
            <div className="mt-4 space-y-3 text-sm">
              {settings.footerLinks.map(({ label, href }) => (
                <Link className="block text-slate-300 transition hover:text-emerald-400" href={href} key={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-bold text-white">Kontak</p>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              {settings.officeAddress ? <p className="flex gap-2"><MapPin size={16} className="mt-0.5 text-emerald-400" /> {settings.officeAddress}</p> : null}
              {settings.phone ? <p className="flex gap-2"><Phone size={16} className="mt-0.5 text-emerald-400" /> {settings.phone}</p> : null}
              {settings.email ? <p className="flex gap-2"><Mail size={16} className="mt-0.5 text-emerald-400" /> {settings.email}</p> : null}
              {settings.serviceHours ? <p className="text-xs text-slate-500">{settings.serviceHours}</p> : null}
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
        © {new Date().getFullYear()} Pemerintah {settings.villageName}. Hak cipta dilindungi.
      </div>
    </footer>
  )
}
