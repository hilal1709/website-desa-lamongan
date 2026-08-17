"use client"

import { useId } from "react"
import Image from "next/image"
import { Download, ImageIcon, Maximize2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const diagramWidth = 1024
const diagramHeight = 768

export interface OrganizationDiagramProps {
  image: string
  title: string
  description?: string
  enlargeLabel?: string
  downloadLabel?: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

function DiagramImage({ image, title, priority = false }: Pick<OrganizationDiagramProps, "image" | "title"> & { priority?: boolean }) {
  return <Image src={image} alt={title} width={diagramWidth} height={diagramHeight} priority={priority} sizes={priority ? "95vw" : "(max-width: 640px) 640px, (max-width: 1024px) calc(100vw - 3rem), 1024px"} className="structure-image h-auto w-full object-contain" />
}

export function OrganizationDiagram({ image, title, description, enlargeLabel, downloadLabel, isOpen, onOpen, onClose }: OrganizationDiagramProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-5xl">
      {description ? <p className="structure-intro mb-5 text-sm font-medium leading-6 text-slate-600 sm:mb-6">{description}</p> : null}
      <Card className="structure-card overflow-hidden rounded-2xl border-slate-200 shadow-xl shadow-slate-900/5 sm:rounded-3xl">
        <header>
          <CardHeader className="flex flex-col gap-4 space-y-0 border-b border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><ImageIcon className="h-5 w-5" aria-hidden="true" /></div>
              <h2 id={headingId} className="text-base font-extrabold text-slate-900 sm:text-lg">{title}</h2>
            </div>
            <div className="structure-toolbar grid w-full grid-cols-1 gap-2 min-[430px]:grid-cols-2 sm:flex sm:w-auto">
              {enlargeLabel ? <Button onClick={onOpen} variant="outline" size="sm" className="w-full sm:w-auto" aria-haspopup="dialog" aria-expanded={isOpen}><Maximize2 />{enlargeLabel}</Button> : null}
              {downloadLabel ? <Button asChild size="sm" className="w-full sm:w-auto"><a href={image} download><Download />{downloadLabel}</a></Button> : null}
            </div>
          </CardHeader>
        </header>
        <CardContent className="p-3 sm:p-8">
          <figure className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
            <div className="min-w-[640px] sm:min-w-0"><DiagramImage image={image} title={title} /></div>
            <figcaption className="sr-only">{title}</figcaption>
          </figure>
        </CardContent>
      </Card>

      {isOpen ? (
        <div role="dialog" aria-modal="true" aria-labelledby={`${headingId}-dialog`} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 backdrop-blur-md sm:p-4">
          <div className="structure-modal-panel relative max-h-[96vh] w-full max-w-[95vw] overflow-auto rounded-2xl border border-white/20 bg-slate-900 p-2 shadow-2xl sm:max-h-[95vh] sm:w-auto sm:rounded-3xl sm:p-4">
            <div className="sticky top-2 right-2 z-10 flex items-center justify-end gap-2 pb-2">
              <h2 id={`${headingId}-dialog`} className="sr-only">{title}</h2>
              {downloadLabel ? <Button asChild size="sm" className="max-w-[calc(100vw-5.5rem)]"><a href={image} download><Download />{downloadLabel}</a></Button> : null}
              <Button onClick={onClose} variant="ghost" size="icon" className="rounded-2xl bg-white/20 text-white hover:bg-white/30 hover:text-white" aria-label="Tutup tampilan gambar"><X className="h-5 w-5" /></Button>
            </div>
            <div className="overflow-hidden rounded-2xl"><DiagramImage image={image} title={title} priority /></div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
