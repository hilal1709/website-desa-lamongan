"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

const informationLinks = [
  { label: "Berita", href: "/berita" },
  { label: "Infografis Desa", href: "/infografis" },
  { label: "Peta Lokasi Bencana", href: "/peta-bencana" },
]

const profileLinks = [
  { label: "Profil Desa", href: "/profil" },
  { label: "Struktur Perangkat Desa", href: "/profil/struktur-perangkat-desa" },
]

const navigation = [
  { label: "Beranda", href: "/" },
  // Profil Desa will be a dropdown now
  { label: "Layanan", href: "/layanan" },
  { label: "Aduan", href: "/aduan" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileNavRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const listener = () => setScrolled(window.scrollY > 12)
    listener()
    window.addEventListener("scroll", listener)
    return () => window.removeEventListener("scroll", listener)
  }, [])

  useEffect(() => {
    if (!open || !mobileNavRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined

    void import("gsap").then(({ default: gsap }) => {
      if (!mobileNavRef.current || cancelled) return

      context = gsap.context(() => {
        gsap.fromTo(mobileNavRef.current, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: "power3.out" })
        gsap.from("[data-mobile-link]", { autoAlpha: 0, x: -12, duration: 0.3, stagger: 0.04, ease: "power2.out", delay: 0.08 })
      }, mobileNavRef)
    })

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [open])

  if (pathname.startsWith("/admin")) {
    return null
  }

  const active = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href.split("#")[0]))
  const informationActive = informationLinks.some((item) => active(item.href))
  const profileActive = profileLinks.some((item) => active(item.href))

  const linkClass = (isActive: boolean) =>
    `relative rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-[#dff5e8] text-[#0f3b2f] shadow-sm ring-1 ring-emerald-200"
        : "text-[#214b3d] hover:bg-[#e9f6ee] hover:text-[#0f3b2f]"
    }`

  const toggleMenu = () => {
    const nextOpen = !open
    setOpen(nextOpen)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    void import("gsap").then(({ default: gsap }) => {
      if (!menuButtonRef.current) return
      gsap.to(menuButtonRef.current, { rotate: nextOpen ? 90 : 0, scale: nextOpen ? 1.08 : 1, duration: 0.24, ease: "power2.out", overwrite: "auto" })
    })
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300`}>
      <div className="bg-transparent px-4 pb-0 pt-4">
      <div className="mx-auto max-w-[1400px]">
        <div
          className={`flex items-center justify-between rounded-full border border-[#b8d8c5]/80 bg-[#dfece1]/75 px-3 py-2 shadow-lg shadow-emerald-900/5 backdrop-blur-sm transition-all duration-300 ${
            scrolled || open ? "border-[#b8d8c5]" : "border-[#b8d8c5]"
          }`}
        >
          <Link href="/" className="flex items-center gap-3" aria-label="Beranda Desa Kedungrejo">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-50 p-1.5">
              <Image
                src="/images/logokedungrejo.jpeg"
                alt="Lambang Desa Kedungrejo"
                width={36}
                height={50}
                className="h-full w-full rounded-full object-cover"
                priority
              />
            </div>
            <div>
              <b className="block text-xs font-black uppercase tracking-[0.18em] text-emerald-950">Desa Kedungrejo</b>
              <small className="block text-[10px] font-medium text-slate-500">Kabupaten Lamongan</small>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-3 lg:flex">
            {navigation.slice(0, 1).map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(active(item.href))}>
                {item.label}
              </Link>
            ))}

            <div className="group relative">
              <Link href="/profil" className={`${linkClass(profileActive)} flex items-center gap-1`} aria-haspopup="true">
                Profil Desa
                <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
              </Link>

              <div className="invisible absolute left-1/2 top-[50px] w-64 -translate-x-1/2 translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl shadow-slate-900/10 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {profileLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active(item.href)
                        ? "bg-emerald-50 text-emerald-800"
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="group relative">
              <button className={`${linkClass(informationActive)} flex items-center gap-1`} aria-haspopup="true">
                Informasi
                <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
              </button>

              <div className="invisible absolute left-1/2 top-[50px] w-64 -translate-x-1/2 translate-y-2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-2xl shadow-slate-900/10 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {informationLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active(item.href)
                        ? "bg-emerald-50 text-emerald-800"
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {navigation.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(active(item.href))}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login" className="inline-flex items-center rounded-full border border-[#b8d8c5] bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-800">
              Login
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            aria-expanded={open}
            aria-label="Buka menu navigasi"
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <nav ref={mobileNavRef} className="mt-3 rounded-3xl border border-slate-200 bg-white/90 p-3 shadow-xl shadow-slate-900/5 backdrop-blur-xl lg:hidden">
            {navigation.slice(0, 1).map((item) => (
              <Link
                onClick={() => setOpen(false)}
                key={item.href}
                href={item.href}
                data-mobile-link
                className={`block rounded-2xl px-3 py-3 text-sm font-semibold ${
                  active(item.href) ? "bg-emerald-50 text-emerald-800" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50 p-2">
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Profil</p>
              {profileLinks.map((item) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={item.label}
                  href={item.href}
                  data-mobile-link
                  className={`block rounded-xl px-3 py-2.5 text-sm font-medium ${
                    active(item.href) ? "bg-emerald-50 text-emerald-800" : "text-slate-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50 p-2">
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Informasi</p>
              {informationLinks.map((item) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={item.label}
                  href={item.href}
                  data-mobile-link
                  className={`block rounded-xl px-3 py-2.5 text-sm font-medium ${
                    active(item.href) ? "bg-emerald-50 text-emerald-800" : "text-slate-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {navigation.slice(1).map((item) => (
              <Link
                onClick={() => setOpen(false)}
                key={item.href}
                href={item.href}
                data-mobile-link
                className={`block rounded-2xl px-3 py-3 text-sm font-semibold ${
                  active(item.href) ? "bg-emerald-50 text-emerald-800" : "text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link onClick={() => setOpen(false)} href="/login" className="mt-2 flex items-center justify-center rounded-2xl bg-emerald-700 px-3 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800">
              Login CMS
            </Link>
          </nav>
        )}
      </div>
      </div>
    </header>
  )
}
