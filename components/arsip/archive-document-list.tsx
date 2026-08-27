"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import Download01Icon from "@hugeicons/core-free-icons/Download01Icon"
import File01Icon from "@hugeicons/core-free-icons/File01Icon"
import LockKeyIcon from "@hugeicons/core-free-icons/LockKeyIcon"
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon"
import { useLayoutEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/ui/status-badge"
import { ArchivePagination } from "./archive-pagination"
import type { PublicDocument } from "./types"

interface ArchiveDocumentListProps {
  documents: PublicDocument[]
  filteredCount: number
  currentPage: number
  pageNumbers: Array<number | null>
  perPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ArchiveDocumentList({ documents, filteredCount, currentPage, pageNumbers, perPage, totalPages, onPageChange }: ArchiveDocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<PublicDocument | null>(null)
  const dialogContent = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!selectedDocument || !dialogContent.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!dialogContent.current || cancelled) return
      context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power3.out" } })
          .fromTo(dialogContent.current, { autoAlpha: 0, y: 22, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38 })
          .fromTo("[data-document-dialog-icon]", { autoAlpha: 0, scale: 0.72, rotate: -8 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.34 }, "-=0.2")
          .fromTo("[data-document-dialog-copy]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, "-=0.18")
      }, dialogContent)
    })
    return () => { cancelled = true; context?.revert() }
  }, [selectedDocument])

  return (
    <>
      <section data-archive-list aria-labelledby="archive-documents-heading" className="mt-5 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm sm:mt-7 sm:rounded-[2rem]">
        <header className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div><h2 id="archive-documents-heading" className="font-bold text-slate-900">Daftar dokumen publik</h2><p className="mt-0.5 text-sm text-slate-500" aria-live="polite">{filteredCount} dokumen ditemukan</p></div><div className="inline-flex w-fit items-center gap-1.5 self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 sm:self-auto"><HugeiconsIcon icon={SparklesIcon} strokeWidth={1.8} aria-hidden="true" className="size-3.5" />Akses terbuka</div></header>
        <div className="divide-y divide-slate-100">
          {documents.map((document) => <article data-archive-document key={document.id} className="group flex flex-col gap-4 px-4 py-5 [content-visibility:auto] transition-colors hover:bg-emerald-50/40 sm:flex-row sm:items-center sm:px-7"><div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600 transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110 sm:h-11 sm:w-11"><HugeiconsIcon icon={File01Icon} strokeWidth={1.8} aria-hidden="true" className="size-5 sm:size-[22px]" /></div><div className="min-w-0"><h3 className="break-words font-bold leading-6 text-slate-900">{document.title}</h3><p className="mt-1 break-words text-sm text-slate-500">{document.meta}</p><div className="mt-2"><StatusBadge>{document.status ?? "Publik"}</StatusBadge></div></div></div><div className="grid w-full shrink-0 grid-cols-2 gap-2 sm:flex sm:w-auto"><Button type="button" variant="outline" onClick={() => setSelectedDocument(document)} className="w-full sm:w-auto">Detail</Button>{document.available === false ? <span className="inline-flex min-h-11 w-full items-center justify-center gap-2 text-center text-sm font-bold text-slate-400 sm:w-auto"><HugeiconsIcon icon={LockKeyIcon} strokeWidth={1.8} className="size-[15px]" />Berkas belum tersedia</span> : <Button asChild className="w-full sm:w-auto"><a href={`/arsip/download/${document.id}`} download aria-label={`Unduh ${document.title}`}><HugeiconsIcon icon={Download01Icon} strokeWidth={1.8} aria-hidden="true" />Unduh <span className="hidden sm:inline">{document.meta.split(" - ")[0]}</span></a></Button>}</div></article>)}
          {filteredCount === 0 && <p className="px-5 py-14 text-center text-sm text-slate-500">Dokumen yang Anda cari belum tersedia. Coba gunakan kata kunci lain.</p>}
        </div>
        {filteredCount > perPage && <ArchivePagination currentPage={currentPage} pageNumbers={pageNumbers} perPage={perPage} totalDocuments={filteredCount} totalPages={totalPages} onPageChange={onPageChange} />}
      </section>

      <Dialog open={Boolean(selectedDocument)} onOpenChange={(open) => { if (!open) setSelectedDocument(null) }}>
        <DialogContent ref={dialogContent} className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)] sm:rounded-3xl">
          {selectedDocument && <><div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-4 sm:p-7"><div data-document-dialog-icon className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600 sm:h-12 sm:w-12"><HugeiconsIcon icon={File01Icon} strokeWidth={1.8} aria-hidden="true" className="size-5 sm:size-6" /></div><DialogClose asChild><Button type="button" variant="ghost" size="icon" className="-mr-2 -mt-2 rounded-full" aria-label="Tutup detail dokumen"><HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.8} className="size-[19px]" /></Button></DialogClose></div><div data-document-dialog-copy className="p-4 pt-0 sm:p-7 sm:pt-0"><p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Dokumen publik</p><DialogTitle className="mt-2 break-words text-xl font-black leading-tight tracking-tight text-slate-950 sm:text-2xl">{selectedDocument.title}</DialogTitle><DialogDescription className="mt-3 text-sm leading-6 text-slate-600">{selectedDocument.meta}</DialogDescription>{selectedDocument.detail && <p className="mt-5 whitespace-pre-line break-words text-sm leading-7 text-slate-700">{selectedDocument.detail}</p>}<div className="mt-5"><StatusBadge>{selectedDocument.status ?? "Publik"}</StatusBadge></div>{selectedDocument.available === false ? <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><HugeiconsIcon icon={LockKeyIcon} strokeWidth={1.8} className="size-4" />Berkas belum tersedia untuk diunduh.</p> : <Button asChild className="mt-6 w-full sm:w-auto"><a href={`/arsip/download/${selectedDocument.id}`} download><HugeiconsIcon icon={Download01Icon} strokeWidth={1.8} aria-hidden="true" />Unduh dokumen</a></Button>}</div></>}
        </DialogContent>
      </Dialog>
    </>
  )
}
