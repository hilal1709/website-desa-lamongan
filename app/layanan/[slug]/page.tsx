import { notFound } from "next/navigation"
import { PageHero } from "@/components/ui/page-hero"
import { ServiceSubmissionForm } from "@/components/layanan/service-submission-form"
import { getVillageServiceBySlug } from "@/lib/village-services"

export const dynamic = "force-dynamic"
export default async function ServiceSubmissionPage({ params }: PageProps<"/layanan/[slug]">) {
  const { slug } = await params
  const service = await getVillageServiceBySlug(slug)
  if (!service) notFound()
  return <main><PageHero eyebrow="Pengajuan layanan" title={service.title} description={`${service.description} Estimasi proses: ${service.estimatedTime}.`} image="/images/dorr.jpg" imagePosition="center" /><section className="mx-auto max-w-4xl px-4 py-12 sm:px-6"><ServiceSubmissionForm service={service} /></section></main>
}
