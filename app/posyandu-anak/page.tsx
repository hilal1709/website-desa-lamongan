import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { ChildHealthManager } from "@/components/anak/child-health-manager"
import { getCurrentHealthUser } from "@/lib/admin-auth"
export const metadata: Metadata = { title: "Posyandu Anak", description: "Ruang kerja internal petugas posyandu bayi dan balita.", robots: { index: false, follow: false } }
export default async function PosyanduAnakPage() { if (!(await getCurrentHealthUser())) redirect("/login"); return <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 sm:py-8"><ChildHealthManager /></main> }
