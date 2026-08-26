import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createNewsHref } from "@/lib/news-routing"
import { NewsArrowLeftIcon, NewsArrowRightIcon } from "./news-icons"

interface NewsPaginationProps {
  currentPage: number
  totalPages: number
  query: string
  category: string
}

export function NewsPagination({ currentPage, totalPages, query, category }: NewsPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => Math.min(Math.max(currentPage - 2, 1), totalPages - 4) + index)
  const hrefForPage = (page: number) => createNewsHref({ query, category, page })

  return (
    <nav aria-label="Paginasi berita" className="news-pagination mt-10 flex flex-wrap items-center justify-center gap-2 sm:mt-12">
      <Button asChild variant="outline" size="sm" className="gap-1" aria-disabled={currentPage === 1} tabIndex={currentPage === 1 ? -1 : undefined}>
        {currentPage === 1 ? <span><NewsArrowLeftIcon /> Sebelumnya</span> : <Link href={hrefForPage(currentPage - 1)}><NewsArrowLeftIcon /> Sebelumnya</Link>}
      </Button>
      <div className="flex items-center gap-1" aria-label={`Halaman ${currentPage} dari ${totalPages}`}>
        {pages.map((page) => <Button key={page} asChild={page !== currentPage} variant={page === currentPage ? "default" : "outline"} size="sm" className="min-w-9" aria-current={page === currentPage ? "page" : undefined}>{page === currentPage ? <span>{page}</span> : <Link href={hrefForPage(page)}>{page}</Link>}</Button>)}
      </div>
      <Button asChild variant="outline" size="sm" className="gap-1" aria-disabled={currentPage === totalPages} tabIndex={currentPage === totalPages ? -1 : undefined}>
        {currentPage === totalPages ? <span>Berikutnya <NewsArrowRightIcon /></span> : <Link href={hrefForPage(currentPage + 1)}>Berikutnya <NewsArrowRightIcon /></Link>}
      </Button>
    </nav>
  )
}
