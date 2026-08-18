"use client"

import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { ShieldCheck } from "lucide-react"
import { ArchiveDocumentList } from "./archive-document-list"
import { ArchiveFilters } from "./archive-filters"
import { categoryFromMeta } from "./document-utils"
import type { PublicDocument } from "./types"

export type { PublicDocument } from "./types"

export function PublicDocumentArchive({ documents, notice }: { documents: PublicDocument[]; notice?: string }) {
  const archiveRef = useRef<HTMLElement>(null)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("Semua dokumen")
  const [page, setPage] = useState(1)
  const perPage = 6
  const categories = useMemo(() => ["Semua dokumen", ...Array.from(new Set(documents.map((document) => categoryFromMeta(document.meta))))], [documents])
  const filteredDocuments = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return documents.filter((document) => {
      const matchesQuery = !keyword || `${document.title} ${document.meta}`.toLowerCase().includes(keyword)
      return matchesQuery && (category === "Semua dokumen" || categoryFromMeta(document.meta) === category)
    })
  }, [category, documents, query])
  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const visibleDocuments = filteredDocuments.slice((currentPage - 1) * perPage, currentPage * perPage)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
    const middle = [currentPage - 1, currentPage, currentPage + 1].filter((item) => item > 1 && item < totalPages)
    return [1, ...(middle[0] > 2 ? [null] : []), ...middle, ...(middle[middle.length - 1] < totalPages - 1 ? [null] : []), totalPages]
  }, [currentPage, totalPages])

  const changeQuery = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const changeCategory = (value: string) => {
    setCategory(value)
    setPage(1)
  }

  useLayoutEffect(() => {
    if (!archiveRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!archiveRef.current || cancelled) return
      context = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>("[data-archive-document]")
        const pagination = archiveRef.current?.querySelector("[data-archive-pagination]")
        gsap.fromTo("[data-archive-toolbar]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" })
        gsap.fromTo(items, { autoAlpha: 0, y: 18, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.055, ease: "power2.out", delay: 0.08 })
        if (pagination) gsap.fromTo(pagination, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", delay: 0.16 })
      }, archiveRef)
    })
    return () => { cancelled = true; context?.revert() }
  }, [currentPage, filteredDocuments.length])

  return (
    <section ref={archiveRef} className="relative mx-auto -mt-8 max-w-7xl px-3 pb-14 sm:-mt-14 sm:px-6 sm:pb-20 lg:px-8">
      <ArchiveFilters categories={categories} category={category} query={query} onCategoryChange={changeCategory} onQueryChange={changeQuery} />

      <ArchiveDocumentList documents={visibleDocuments} filteredCount={filteredDocuments.length} currentPage={currentPage} pageNumbers={pageNumbers} perPage={perPage} totalPages={totalPages} onPageChange={setPage} />

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950 sm:mt-6 sm:px-5"><ShieldCheck className="mt-0.5 shrink-0 text-amber-700" size={19} /><p>{notice ?? "Arsip diperbarui secara berkala oleh operator Pemerintah Desa Kedungrejo."}</p></div>
    </section>
  )
}
