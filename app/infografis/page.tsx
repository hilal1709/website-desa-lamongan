import { Hero } from "@/components/infografis/Hero"
import { InfographicDashboard } from "@/components/infografis/infographic-dashboard"
import { getCachedInfographicData } from "@/lib/infographic-data"
import { getCachedUmkmData } from "@/lib/umkm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Infografis Desa | Kedungrejo",
  description: "Data kependudukan, demografi, pendidikan, dan tren penduduk Desa Kedungrejo dalam bentuk infografis interaktif.",
  keywords: ["infografis desa", "data penduduk", "Desa Kedungrejo", "Lamongan", "demografi desa"],
  alternates: { canonical: "/infografis" },
  openGraph: {
    title: "Infografis Desa Kedungrejo",
    description: "Data kependudukan dan demografi Desa Kedungrejo.",
    url: "/infografis",
    type: "website",
  },
  robots: { index: true, follow: true },
}
export default async function InfografisPage() {
  const [data, umkm] = await Promise.all([getCachedInfographicData(), getCachedUmkmData()])

  return (
    <>
      <Hero />
      <main className="bg-slate-50 px-3 py-7 sm:px-5 sm:py-10 lg:py-14" suppressHydrationWarning>
        <div className="mx-auto max-w-7xl">
          <InfographicDashboard
            {...data}
            umkm={umkm}
          />
        </div>
      </main>
    </>
  )
}
