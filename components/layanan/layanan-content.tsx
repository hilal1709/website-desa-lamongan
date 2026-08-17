import { LayananMotion } from "@/components/layanan/layanan-motion"
import { ServiceFlow } from "@/components/layanan/service-flow"
import { ServiceList } from "@/components/layanan/service-list"
import type { CmsSectionItem } from "@/lib/cms-pages"

interface LayananContentProps { services: CmsSectionItem[]; flowTitle?: string; flowItems: CmsSectionItem[] }

export function LayananContent({ services, flowTitle, flowItems }: LayananContentProps) {
  return <LayananMotion><section aria-labelledby="services-heading"><h2 id="services-heading" className="sr-only">Layanan desa tersedia</h2><ServiceList services={services} /></section><ServiceFlow title={flowTitle} items={flowItems} /></LayananMotion>
}
