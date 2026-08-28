import { CmsInfographicModules } from "@/components/infografis/cms-infographic-modules"
import { CmsInfographicWorkflow } from "@/components/infografis/cms-infographic-workflow"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminInfographicMotion } from "@/components/infografis/admin-infographic-motion"
import { prisma } from "@/app/lib/prisma"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kelola Infografis",
  description: "Kelola data kependudukan dan profil warga untuk infografis Desa Kedungrejo.",
  robots: { index: false, follow: false },
}

export default async function AdminInfografisPage() {
  const [events, balances, residents] = await Promise.all([
    prisma.populationEvent.findMany({ orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }], take: 100 }),
    prisma.populationOpeningBalance.findMany({ orderBy: { dusun: "asc" } }),
    prisma.resident.findMany({ where: { isActive: true }, orderBy: { fullName: "asc" }, take: 200 }),
  ])
  const initialEvents = events.map((event) => ({ ...event, eventDate: event.eventDate.toISOString(), birthDate: event.birthDate.toISOString() }))
  const initialBalances = balances.map((balance) => ({ ...balance, effectiveDate: balance.effectiveDate.toISOString() }))
  const initialResidents = residents.map((resident) => ({ ...resident, birthDate: resident.birthDate.toISOString() }))
  return <AdminInfographicMotion><section data-admin-reveal aria-label="Kependudukan dan infografis" className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Kependudukan" title="Kependudukan & infografis" description="Kelola angka penduduk resmi melalui data dasar dan peristiwa. Profil warga dipakai khusus untuk visual pendidikan serta mata pencaharian." /><div className="mt-5 space-y-6"><CmsInfographicWorkflow /><div data-cms-infographic-section><CmsInfographicModules initialEvents={initialEvents} initialBalances={initialBalances} initialResidents={initialResidents} /></div></div></section></AdminInfographicMotion>
}
