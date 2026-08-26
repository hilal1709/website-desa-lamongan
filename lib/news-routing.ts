export interface NewsSearchParams {
  q?: string | string[]
  kategori?: string | string[]
  halaman?: string | string[]
}

export interface NewsFiltersFromUrl {
  query: string
  category: string
  page: number
}

function firstValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : value?.[0] ?? ""
}

export function parseNewsFilters(searchParams: NewsSearchParams): NewsFiltersFromUrl {
  const requestedPage = Number(firstValue(searchParams.halaman))

  return {
    query: firstValue(searchParams.q).slice(0, 100),
    category: firstValue(searchParams.kategori).slice(0, 80),
    page: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  }
}

export function createNewsHref({ query = "", category = "", page = 1 }: Partial<NewsFiltersFromUrl> = {}) {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (category) params.set("kategori", category)
  if (page > 1) params.set("halaman", String(page))

  const search = params.toString()
  return search ? `/berita?${search}` : "/berita"
}
