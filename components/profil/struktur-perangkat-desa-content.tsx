"use client"

import { useLayoutEffect, useRef, useState } from "react"

import { OrganizationDiagram } from "@/components/profil/organization-diagram"
import { PageHero } from "@/components/ui/page-hero"
import type { CmsPageContent } from "@/lib/cms-pages"

export function StrukturPerangkatDesaContent({ page }: { page: CmsPageContent }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const diagram = page.sections.find((section) => section.key === "organization-chart")
  const image = diagram?.image ?? page.image
  const title = diagram?.title ?? page.title

  useLayoutEffect(() => {
    if (!rootRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined

    void import("gsap").then(({ default: gsap }) => {
      if (!rootRef.current || cancelled) return

      context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } })
        timeline
          .from(".structure-intro", { opacity: 0, y: 24, duration: 0.65 })
          .from(".structure-card", { opacity: 0, y: 38, scale: 0.98, duration: 0.8 }, "-=0.25")
          .from(".structure-toolbar", { x: 14, duration: 0.45 }, "-=0.35")
          .from(".structure-image", { opacity: 0, y: 28, scale: 0.985, duration: 0.85 }, "-=0.25")
      }, rootRef)
    })

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [])

  useLayoutEffect(() => {
    if (!isDialogOpen || !rootRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let context: ReturnType<typeof import("gsap").default.context> | undefined

    void import("gsap").then(({ default: gsap }) => {
      if (!rootRef.current || cancelled) return

      context = gsap.context(() => {
        gsap.fromTo("[role='dialog']", { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" })
        gsap.fromTo(".structure-modal-panel", { opacity: 0, y: 22, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: "power3.out", delay: 0.05 })
      }, rootRef)
    })

    return () => {
      cancelled = true
      context?.revert()
    }
  }, [isDialogOpen])

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} image={page.image} imagePosition={page.imagePosition} />
      <main id="main-content" ref={rootRef} className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-16">
        <OrganizationDiagram
          image={image}
          title={title}
          description={diagram?.description}
          enlargeLabel={diagram?.items?.[0]?.title}
          downloadLabel={diagram?.items?.[1]?.title}
          isOpen={isDialogOpen}
          onOpen={() => setIsDialogOpen(true)}
          onClose={() => setIsDialogOpen(false)}
        />
      </main>
    </>
  )
}
