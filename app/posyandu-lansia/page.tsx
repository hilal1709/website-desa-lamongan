import { ElderlyHealthManager } from "@/components/lansia/elderly-health-manager"
import { getCurrentHealthUser } from "@/lib/admin-auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Posyandu Lansia", description: "Ruang kerja internal petugas posyandu lansia.", robots: { index: false, follow: false } }

export default async function PosyanduLansiaPage() {
  if (!(await getCurrentHealthUser())) redirect("/login")
  return <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 sm:py-8"><ElderlyHealthManager /></main>
}
