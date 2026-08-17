import { NewsManager } from "@/components/admin/news-manager"
export const metadata = { title: "Kelola Berita | CMS Kedungrejo" }
export default function BeritaAdminPage() { return <div className="py-1 sm:py-2"><p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-700">CMS Berita</p><h1 className="mt-1 text-3xl font-black text-slate-950">Artikel berita desa</h1><p className="mt-2 text-sm text-slate-600">Tambah kategori dan kelola artikel yang akan ditampilkan kepada warga.</p><div className="mt-5"><NewsManager /></div></div> }
