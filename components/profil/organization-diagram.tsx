"use client"

import { useId } from "react"
import dynamic from "next/dynamic"
import { HugeiconsIcon } from "@hugeicons/react"
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon"
import Image01Icon from "@hugeicons/core-free-icons/Image01Icon"
import Maximize01Icon from "@hugeicons/core-free-icons/Maximize01Icon"

import { OrganizationDiagramBadges, OrganizationDiagramLegend } from "@/components/profil/organization-diagram-guidance"
import { OrganizationDiagramImage } from "@/components/profil/organization-diagram-image"
import { organizationDiagramDefaults, type OrganizationDiagramProps } from "@/components/profil/organization-diagram-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const OrganizationDiagramModal = dynamic(
  () => import("@/components/profil/organization-diagram-modal").then((module) => module.OrganizationDiagramModal),
  { ssr: false },
)

export type { OrganizationDiagramProps } from "@/components/profil/organization-diagram-types"

export function OrganizationDiagram({ image, title, description, enlargeLabel, downloadLabel, isOpen, onOpen, onClose }: OrganizationDiagramProps) {
  const headingId = useId()
  const enlargeActionLabel = enlargeLabel?.trim() || organizationDiagramDefaults.enlargeLabel
  const downloadActionLabel = downloadLabel?.trim() || organizationDiagramDefaults.downloadLabel

  return (
    <section aria-labelledby={headingId} className="mx-auto min-w-0 max-w-5xl">
      <div className="structure-intro mb-5 max-w-3xl sm:mb-7">
        {description ? <p className="break-words text-sm font-medium leading-6 text-slate-600">{description}</p> : null}
        <OrganizationDiagramBadges coordinationLabel={organizationDiagramDefaults.coordinationLabel} detailLabel={organizationDiagramDefaults.detailLabel} />
      </div>
      <Card className="structure-card overflow-hidden rounded-2xl border-slate-200 shadow-xl shadow-slate-900/5 sm:rounded-3xl">
        <header>
          <CardHeader className="flex flex-col gap-4 space-y-0 border-b border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><HugeiconsIcon icon={Image01Icon} strokeWidth={1.8} className="h-5 w-5" aria-hidden="true" /></div>
              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">Bagan organisasi</p>
                <h2 id={headingId} className="break-words text-base font-extrabold text-slate-900 sm:text-lg">{title}</h2>
              </div>
            </div>
            <nav className="structure-toolbar grid w-full grid-cols-1 gap-2 min-[430px]:grid-cols-2 sm:flex sm:w-auto" aria-label="Aksi bagan organisasi">
              <Button onClick={onOpen} variant="outline" size="sm" className="w-full sm:w-auto" aria-haspopup="dialog" aria-expanded={isOpen}><HugeiconsIcon icon={Maximize01Icon} strokeWidth={1.8} aria-hidden="true" />{enlargeActionLabel}</Button>
              <Button asChild size="sm" className="w-full sm:w-auto"><a href={image} download><HugeiconsIcon icon={Download01Icon} strokeWidth={1.8} aria-hidden="true" />{downloadActionLabel}</a></Button>
            </nav>
          </CardHeader>
        </header>
        <CardContent className="p-3 sm:p-8">
          <figure className="structure-image-frame overflow-hidden rounded-xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,_#f0fdf4,_#ffffff_44%)] p-1 shadow-sm sm:rounded-2xl sm:p-2">
            <div className="min-w-0"><OrganizationDiagramImage image={image} title={title} /></div>
            <figcaption className="sr-only">{title}</figcaption>
          </figure>
          <OrganizationDiagramLegend />
        </CardContent>
      </Card>

      {isOpen ? <OrganizationDiagramModal image={image} title={title} downloadLabel={downloadActionLabel} onClose={onClose} /> : null}
    </section>
  )
}
