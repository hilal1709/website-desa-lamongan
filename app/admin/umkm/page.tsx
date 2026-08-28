import { PackageCheck, Store, StoreIcon } from "lucide-react"
import { LazyUmkmManager } from "@/components/admin/lazy-cms-editors"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/app/lib/prisma"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { canAccess, firstPermittedCmsPath } from "@/lib/access-control"
import { redirect } from "next/navigation"

export const metadata = { title: "Kelola UMKM | Admin Kedungrejo" }

export default async function AdminUmkmPage() {
  const user = await getCurrentAdmin()
  if (!user || !canAccess(user, "UMKM")) redirect(user ? firstPermittedCmsPath(user) ?? "/login" : "/login")

  const businesses = await prisma.umkm.findMany({ include: { products: { orderBy: { name: "asc" } } }, orderBy: { updatedAt: "desc" } })
  const productCount = businesses.reduce((total, business) => total + business.products.length, 0)
  const publishedCount = businesses.filter((business) => business.isPublished).length

  return <section data-admin-reveal aria-labelledby="kelola-katalog-umkm-title" className="py-1 sm:py-2"><div className="mx-auto max-w-6xl"><header className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-6 text-white shadow-xl shadow-emerald-950/15 sm:p-9"><div data-admin-orb className="absolute -right-12 -top-14 size-52 rounded-full bg-lime-300/15 blur-2xl" /><div data-admin-orb-secondary className="absolute -bottom-20 right-1/4 size-48 rounded-full bg-cyan-300/10 blur-2xl" /><div className="relative"><span className="grid size-12 place-items-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur"><Store className="size-6" aria-hidden="true" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-emerald-200">Pusat katalog lokal</p><h1 id="kelola-katalog-umkm-title" className="mt-2 text-2xl font-black sm:text-3xl">Kelola Katalog UMKM</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50">Atur profil usaha, produk, harga, dan kanal pemesanan agar warga dapat menemukan produk unggulan desa dengan mudah.</p><div className="mt-6 grid max-w-xl grid-cols-3 gap-2 sm:gap-3"><Stat icon={<StoreIcon className="size-4 text-lime-200" />} value={businesses.length} label="Usaha tercatat" /><Stat icon={<PackageCheck className="size-4 text-lime-200" />} value={productCount} label="Produk katalog" /><Stat icon={<span className="grid size-4 place-items-center rounded-full bg-lime-300"><span className="size-1.5 rounded-full bg-emerald-950" /></span>} value={publishedCount} label="Sedang tayang" /></div></div></header><Card data-admin-reveal className="mt-5 border-emerald-100 bg-emerald-50/70 shadow-none sm:mt-7"><CardContent className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="text-sm font-bold text-emerald-950">Alur pengelolaan cepat</p><p className="mt-1 text-xs leading-5 text-emerald-800">Lengkapi profil, simpan, lalu tambahkan produk pada katalog usaha.</p></div><Button variant="outline" size="sm" asChild><a href="#katalog-umkm">Buka katalog</a></Button></CardContent></Card><section id="katalog-umkm" className="mt-5 scroll-mt-5 sm:mt-7"><LazyUmkmManager initialBusinesses={businesses} /></section></div></section>
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return <div data-admin-reveal className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">{icon}<p className="mt-2 text-xl font-black">{value}</p><p className="text-xs text-emerald-100">{label}</p></div>
}
