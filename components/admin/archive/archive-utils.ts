export async function responseBody<T>(response: Response): Promise<T & { message?: string }> {
  try { return await response.json() } catch { return {} as T & { message?: string } }
}

export function formatArchiveDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "Tanggal belum tersedia" : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}
