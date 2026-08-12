import { Info } from "lucide-react"

export function DevelopmentBanner() {
  return <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm leading-6 text-green-900"><Info className="mt-0.5 shrink-0 text-green-700" size={18}/><p><span className="font-bold">Data sementara untuk pengembangan.</span> Angka pada halaman ini akan diperbarui secara berkala oleh Pemerintah Desa Kedungrejo.</p></div>
}
