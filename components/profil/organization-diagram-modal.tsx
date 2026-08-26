"use client"

import { useLayoutEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { OrganizationDiagramImage } from "@/components/profil/organization-diagram-image"

interface OrganizationDiagramModalProps {
  image: string
  title: string
  downloadLabel: string
  onClose: () => void
}

export function OrganizationDiagramModal({ image, title, downloadLabel, onClose }: OrganizationDiagramModalProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!contentRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    void import("gsap").then(({ default: gsap }) => {
      if (!contentRef.current || cancelled) return
      gsap.fromTo(contentRef.current, { autoAlpha: 0, y: -12, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: "power3.out", clearProps: "opacity,transform,visibility" })
    })

    return () => { cancelled = true }
  }, [])

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent ref={contentRef} aria-describedby={undefined} className="max-h-[96dvh] max-w-[calc(100vw-1rem)] overflow-auto rounded-2xl border border-white/20 bg-slate-900 p-2 shadow-2xl sm:max-h-[95vh] sm:max-w-[95vw] sm:w-auto sm:rounded-3xl sm:p-4">
        <div className="sticky top-2 right-2 z-10 flex min-w-0 items-center justify-end gap-2 pb-2">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <Button asChild size="sm" className="max-w-[calc(100vw-5.5rem)]"><a href={image} download><HugeiconsIcon icon={Download01Icon} strokeWidth={1.8} aria-hidden="true" />{downloadLabel}</a></Button>
          <DialogClose asChild><Button variant="ghost" size="icon" className="rounded-2xl bg-white/20 text-white hover:bg-white/30 hover:text-white" aria-label="Tutup tampilan gambar"><HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.8} className="h-5 w-5" aria-hidden="true" /></Button></DialogClose>
        </div>
        <div className="min-w-0 overflow-hidden rounded-2xl"><OrganizationDiagramImage image={image} title={title} sizes="95vw" /></div>
      </DialogContent>
    </Dialog>
  )
}
