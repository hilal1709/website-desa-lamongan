"use client"

import { useLayoutEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import Shield01Icon from "@hugeicons/core-free-icons/Shield01Icon"
import { ArchiveDocumentList } from "./archive-document-list"
import { ArchiveFilters } from "./archive-filters"
import type { PublicDocument } from "./types"
import { useArchiveDocuments } from "./use-archive-documents"

export type { PublicDocument } from "./types"

export function PublicDocumentArchive({ documents, notice }: { documents: PublicDocument[]; notice?: string }) {
  const archiveRef = useRef<HTMLElement>(null)
  const archive = useArchiveDocuments(documents)

  useLayoutEffect(() => {
    if (!archiveRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined
    void import("gsap").then(({ default: gsap }) => {
      if (!archiveRef.current || cancelled) return
      context = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>("[data-archive-document]")
        const pagination = archiveRef.current?.querySelector("[data-archive-pagination]")
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline
          .fromTo("[data-archive-toolbar]", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45 })
          .fromTo("[data-archive-list]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.2")
          .fromTo(items, { autoAlpha: 0, x: -12, scale: 0.985 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.42, stagger: 0.055, ease: "power2.out" }, "-=0.2")
        if (pagination) timeline.fromTo(pagination, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.2")
        timeline.fromTo("[data-archive-notice]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.15")

        const removeHoverListeners = items.map((item) => {
          const enter = () => gsap.to(item, { x: 5, duration: 0.22, ease: "power2.out", overwrite: "auto" })
          const leave = () => gsap.to(item, { x: 0, duration: 0.28, ease: "power2.out", overwrite: "auto" })
          item.addEventListener("mouseenter", enter)
          item.addEventListener("mouseleave", leave)
          return () => {
            item.removeEventListener("mouseenter", enter)
            item.removeEventListener("mouseleave", leave)
          }
        })
        return () => removeHoverListeners.forEach((remove) => remove())
      }, archiveRef)
    })
    return () => { cancelled = true; context?.revert() }
  }, [archive.currentPage, archive.filteredCount])

  return (
    <section ref={archiveRef} className="relative mx-auto -mt-8 max-w-7xl overflow-hidden px-3 pb-14 sm:-mt-14 sm:px-6 sm:pb-20 lg:px-8">
      <ArchiveFilters categories={archive.categories} category={archive.category} query={archive.query} onCategoryChange={archive.setCategory} onQueryChange={archive.setQuery} />

      <ArchiveDocumentList documents={archive.visibleDocuments} filteredCount={archive.filteredCount} currentPage={archive.currentPage} pageNumbers={archive.pageNumbers} perPage={archive.perPage} totalPages={archive.totalPages} onPageChange={archive.setPage} />

      <div data-archive-notice className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-950 sm:mt-6 sm:px-5"><HugeiconsIcon icon={Shield01Icon} strokeWidth={1.8} className="mt-0.5 size-[19px] shrink-0 text-amber-700" aria-hidden="true" /><p>{notice ?? "Arsip diperbarui secara berkala oleh operator Pemerintah Desa Kedungrejo."}</p></div>
    </section>
  )
}
