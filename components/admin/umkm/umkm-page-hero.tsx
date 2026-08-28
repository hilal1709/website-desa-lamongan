import { HugeiconsIcon } from "@hugeicons/react"
import { PackageCheckIcon, Store01Icon } from "@hugeicons/core-free-icons"

type UmkmPageHeroProps = { businessCount: number; productCount: number; publishedCount: number }

export function UmkmPageHero({ businessCount, productCount, publishedCount }: UmkmPageHeroProps) {
  return <header className="relative overflow-hidden rounded-[32px] bg-emerald-900 p-6 text-white shadow-xl shadow-emerald-950/15 sm:p-9"><div data-admin-orb className="absolute -right-12 -top-14 size-52 rounded-full bg-lime-300/15 blur-2xl" /><div data-admin-orb-secondary className="absolute -bottom-20 right-1/4 size-48 rounded-full bg-cyan-300/10 blur-2xl" /><div className="relative"><span className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur"><HugeiconsIcon icon={Store01Icon} className="size-6" aria-hidden="true" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Pusat katalog lokal</p><h1 id="kelola-katalog-umkm-title" className="mt-2 text-2xl font-black sm:text-3xl">Kelola Katalog UMKM</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50">Atur profil usaha, produk, harga, dan kanal pemesanan agar warga dapat menemukan produk unggulan desa dengan mudah.</p><dl className="mt-6 grid max-w-xl grid-cols-3 gap-2 sm:gap-3"><Metric icon={Store01Icon} value={businessCount} label="Usaha tercatat" /><Metric icon={PackageCheckIcon} value={productCount} label="Produk katalog" /><Metric value={publishedCount} label="Sedang tayang" /></dl></div></header>
}

function Metric({ icon, value, label }: { icon?: typeof Store01Icon; value: number; label: string }) {
  return <div data-admin-reveal className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur"><dt>{icon ? <HugeiconsIcon icon={icon} className="size-4 text-lime-200" aria-hidden="true" /> : <span className="grid size-4 place-items-center rounded-full bg-lime-300"><span className="size-1.5 rounded-full bg-emerald-950" /></span>}</dt><dd className="mt-2 text-xl font-black">{value}</dd><dt className="text-xs text-emerald-100">{label}</dt></div>
}
