import { CmsPageEditor } from "@/components/admin/cms-page-editor"
export const metadata = { title: "Konten Halaman | CMS Kedungrejo" }
export default function KontenPage() { return <div className="py-1 sm:py-2"><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">CMS Konten</p><h1 className="mt-1 text-3xl font-black text-slate-950">Konten halaman publik</h1><p className="mt-2 text-sm text-slate-600">Perbarui hero dan section halaman website desa.</p><div className="mt-5"><CmsPageEditor /></div></div> }
