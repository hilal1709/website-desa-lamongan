"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const informationLinks = [
  { label: "Berita", href: "/berita" },
  { label: "Infografis Desa", href: "/infografis" },
  { label: "Data Rekam Medis", href: "/stunting" },
  { label: "Peta Lokasi Bencana", href: "/data-desa" },
]
const navigation = [{ label: "Beranda", href: "/" }, { label: "Profil Desa", href: "/profil" }, { label: "Layanan", href: "/layanan" }, { label: "Kontak", href: "/aduan" }]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  useEffect(() => { const listener = () => setScrolled(window.scrollY > 12); listener(); window.addEventListener("scroll", listener); return () => window.removeEventListener("scroll", listener) }, [])
  const active = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href)
  const informationActive = informationLinks.some((item) => active(item.href))
  const linkClass = (isActive: boolean) => `relative py-7 text-sm font-semibold transition-colors ${isActive ? "text-emerald-800 after:absolute after:bottom-5 after:left-0 after:h-0.5 after:w-full after:bg-emerald-700" : "text-slate-600 hover:text-emerald-800"}`

  return <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled || open ? "border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl" : "border-slate-100 bg-white/90 backdrop-blur"}`}>
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
      <Link href="/" className="flex items-center gap-2.5" aria-label="Beranda Desa Kedungrejo"><Image src="/images/logokedungrejo.jpeg" alt="Lambang Desa Kedungrejo" width={36} height={50} className="h-12 w-auto shrink-0 object-contain" priority/><span><b className="block text-sm leading-none text-emerald-950">DESA KEDUNGREJO</b><small className="mt-1 block text-[11px] font-medium text-slate-500">Kabupaten Lamongan</small></span></Link>
      <nav className="hidden h-full items-center gap-7 lg:flex">{navigation.slice(0, 2).map((item) => <Link key={item.href} href={item.href} className={linkClass(active(item.href))}>{item.label}</Link>)}<div className="group relative h-full"><button className={`${linkClass(informationActive)} flex items-center gap-1`} aria-haspopup="true">Informasi <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180"/></button><div className="invisible absolute left-1/2 top-[58px] w-60 -translate-x-1/2 translate-y-2 rounded-xl border border-slate-100 bg-white p-2 opacity-0 shadow-xl shadow-slate-900/10 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">{informationLinks.map((item) => <Link key={item.label} href={item.href} className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${active(item.href) ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"}`}>{item.label}</Link>)}</div></div>{navigation.slice(2).map((item) => <Link key={item.href} href={item.href} className={linkClass(active(item.href))}>{item.label}</Link>)}</nav>
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Buka menu navigasi" className="grid size-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden">{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <nav className="border-t border-slate-100 bg-white px-5 py-3 shadow-lg lg:hidden">{navigation.slice(0, 2).map((item) => <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className={`block rounded-lg px-3 py-3 text-sm font-semibold ${active(item.href) ? "bg-emerald-50 text-emerald-800" : "text-slate-700"}`}>{item.label}</Link>)}<p className="px-3 pt-3 text-xs font-bold uppercase tracking-wider text-slate-400">Informasi</p>{informationLinks.map((item) => <Link onClick={() => setOpen(false)} key={item.label} href={item.href} className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${active(item.href) ? "bg-emerald-50 text-emerald-800" : "text-slate-600"}`}>{item.label}</Link>)}{navigation.slice(2).map((item) => <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className={`block rounded-lg px-3 py-3 text-sm font-semibold ${active(item.href) ? "bg-emerald-50 text-emerald-800" : "text-slate-700"}`}>{item.label}</Link>)}</nav>}
  </header>
}
