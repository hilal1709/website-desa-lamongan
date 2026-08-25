"use client"

import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  return <section aria-labelledby="archive-documents-heading" className="mt-5 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm sm:mt-7 sm:rounded-[2rem]"><header className="border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-7"><h2 id="archive-documents-heading" className="font-bold text-slate-900">Daftar dokumen publik</h2><p className="mt-0.5 text-sm text-slate-500" aria-live="polite">{filteredCount} dokumen ditemukan</p></header><div className="divide-y divide-slate-100">{documents.map((document) => <article data-archive-document key={document.id} className="group flex flex-col gap-4 px-4 py-5 [content-visibility:auto] transition-colors hover:bg-emerald-50/40 sm:flex-row sm:items-center sm:px-7"><div className="flex min-w-0 flex-1 items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600"><FileText size={22} aria-hidden="true" /></div><div className="min-w-0"><h3 className="break-words font-bold leading-6 text-slate-900">{document.title}</h3><p className="mt-1 break-words text-sm text-slate-500">{document.meta}</p><div className="mt-2"><StatusBadge>{document.status ?? "Publik"}</StatusBadge></div></div></div>{document.available === false ? <span className="w-full text-center text-sm font-bold text-slate-400 sm:w-auto">Berkas belum tersedia</span> : <Button asChild className="w-full shrink-0 sm:w-auto"><a href={`/arsip/download/${document.id}`} download aria-label={`Unduh ${document.title}`}><Download aria-hidden="true" />Unduh {document.meta.split(" - ")[0]}</a></Button>}</article>)}{filteredCount === 0 && <p className="px-5 py-14 text-center text-sm text-slate-500">Dokumen yang Anda cari belum tersedia. Coba gunakan kata kunci lain.</p>}</div>{filteredCount > perPage && <ArchivePagination currentPage={currentPage} pageNumbers={pageNumbers} perPage={perPage} totalDocuments={filteredCount} totalPages={totalPages} onPageChange={onPageChange} />}</section>
}
