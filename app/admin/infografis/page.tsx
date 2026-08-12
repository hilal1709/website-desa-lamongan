import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"
import { InfographicForm } from "@/components/infografis/infographic-form"

export const metadata = { title: "Kelola Infografis | Admin Kedungrejo" }

export default function AdminInfografisPage() { return <main className="min-h-screen bg-slate-50 px-5 py-10 sm:py-14" suppressHydrationWarning><div className="mx-auto max-w-4xl"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 transition hover:text-emerald-950"><ArrowLeft size={17}/> Kembali ke dashboard</Link><header className="mt-7 rounded-3xl bg-gradient-to-br from-green-800 to-emerald-700 p-7 text-white shadow-lg shadow-green-900/15 sm:p-9"><span className="grid size-12 place-items-center rounded-2xl bg-white/15"><BarChart3 size={24}/></span><h1 className="mt-6 text-3xl font-bold tracking-tight">Kelola Infografis Desa</h1><p className="mt-3 max-w-xl leading-7 text-green-50">Masukkan atau perbarui data kependudukan, usia, pendidikan, dan mata pencaharian per dusun.</p></header><section className="mt-7"><InfographicForm/></section></div></main> }
