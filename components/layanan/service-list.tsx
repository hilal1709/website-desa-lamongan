import { ServiceCard } from "@/components/layanan/service-card"
import type { CmsSectionItem } from "@/lib/cms-pages"

export function ServiceList({ services }: { services: CmsSectionItem[] }) {
  if (!services.length) return <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm font-semibold text-slate-500">Belum ada layanan yang tersedia.</p>
  return <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">{services.map((service, index) => <li key={`${service.title}-${index}`}><ServiceCard service={service} /></li>)}</ul>
}
