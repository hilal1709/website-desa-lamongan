"use client"

import dynamic from "next/dynamic"

import { ComplaintShieldIcon } from "@/components/aduan/complaint-icons"
import { ComplaintFlow } from "@/components/aduan/complaint-flow"
import { ComplaintForm } from "@/components/aduan/complaint-form"
import { ComplaintHistory } from "@/components/aduan/complaint-history"
import { ComplaintMotion } from "@/components/aduan/complaint-motion"
import { useComplaintPage } from "@/components/aduan/use-complaint-page"
import type { ComplaintPage } from "@/lib/complaint-types"
import type { CmsSection } from "@/lib/cms-pages"

type ComplaintPageContentProps = {
  formSection?: CmsSection
  historyTitle?: string
  complaintPage: ComplaintPage
}

const ComplaintNotificationDialog = dynamic(
  () => import("@/components/aduan/complaint-notification-dialog").then((module) => module.ComplaintNotificationDialog),
  { ssr: false },
)

export function ComplaintPageContent({ formSection, historyTitle, complaintPage: initialComplaintPage }: ComplaintPageContentProps) {
  const { complaintPage, handlePageChange, handleSubmit, isHistoryLoading, isSubmitting, notice, dismissNotice } = useComplaintPage(initialComplaintPage)

  return (
    <ComplaintMotion>
      <span aria-hidden className="complaint-orb absolute left-[8%] top-20 size-32 rounded-full bg-emerald-100/55 blur-3xl" />
      <span aria-hidden className="complaint-orb absolute right-[5%] top-52 size-44 rounded-full bg-lime-100/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl">
        <aside className="complaint-intro mb-7 flex max-w-2xl items-start gap-3 sm:mb-8 sm:gap-4" aria-label="Informasi privasi aduan">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><ComplaintShieldIcon aria-hidden size={22} /></div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900">Laporan Anda dikelola dengan aman</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Lengkapi informasi seperlunya agar petugas dapat menindaklanjuti aduan dengan tepat.</p>
          </div>
        </aside>

        <ComplaintFlow />

        <div className="grid items-start gap-7 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
          <ComplaintForm section={formSection} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
          <ComplaintHistory title={historyTitle} complaints={complaintPage.complaints} page={complaintPage.page} pageSize={complaintPage.pageSize} totalItems={complaintPage.totalItems} totalPages={complaintPage.totalPages} isLoading={isHistoryLoading} onPageChange={handlePageChange} />
        </div>
      </div>
      {notice ? <ComplaintNotificationDialog message={notice} onOpenChange={(open) => !open && dismissNotice()} /> : null}
    </ComplaintMotion>
  )
}
