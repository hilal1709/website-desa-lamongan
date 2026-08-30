import { createXlsx } from "@/lib/xlsx-export"
import { getPublicPopulationEventExport, parsePopulationFilters } from "@/lib/population-events"
import { requireCmsPermission } from "@/lib/api-access"
import { audit } from "@/lib/audit-log"
import { clientAddress } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

const headers = ["Tanggal peristiwa", "Jenis peristiwa", "Nama", "Jenis kelamin", "Tahun lahir", "Dusun"]

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`
}

export async function GET(request: Request) {
  const access = await requireCmsPermission("INFOGRAPHICS", "update")
  if (access.response) return access.response
  try {
    const filters = parsePopulationFilters(new URL(request.url).searchParams)
    const format = new URL(request.url).searchParams.get("format") === "xlsx" ? "xlsx" : "csv"
    const records = await getPublicPopulationEventExport(filters)
    const rows = [headers, ...records.map((record) => [record.eventDate, record.typeLabel, record.fullName, record.gender, record.birthYear, record.dusun])]
    const suffix = `${filters.year}${filters.month ? `-${String(filters.month).padStart(2, "0")}` : ""}`
    const filename = `detail-peristiwa-kependudukan-${suffix}.${format}`
    await audit("POPULATION_EVENT_EXPORT_DOWNLOADED", "POPULATION_EVENT", { actorId: access.user!.id, targetId: filename, ip: clientAddress(request.headers) })

    if (format === "xlsx") {
      return new Response(createXlsx(rows), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      })
    }

    return new Response(`\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return Response.json({ error: "Berkas unduhan belum dapat dibuat." }, { status: 500 })
  }
}
