import { revalidatePath } from "next/cache"
import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { parseResidentInput, residentData } from "@/lib/residents"
import { publishCmsUpdate } from "@/lib/pusher"

const headers = ["nik", "nama", "nomor_kk", "jenis_kelamin", "tanggal_lahir", "dusun", "pendidikan", "pekerjaan", "status_aktif"]
function cells(line: string) { const values: string[] = []; let value = "", quoted = false; for (let index = 0; index < line.length; index++) { const char = line[index]; if (char === '"') { if (quoted && line[index + 1] === '"') { value += char; index++ } else quoted = !quoted } else if (char === "," && !quoted) { values.push(value.trim()); value = "" } else value += char } values.push(value.trim()); return values }

export async function POST(request: Request) {
  const access = await requireCmsPermission("INFOGRAPHICS", "create"); if (access.response) return access.response
  const form = await request.formData(); const file = form.get("file")
  if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".csv")) return Response.json({ message: "Unggah berkas CSV sesuai template." }, { status: 400 })
  const lines = (await file.text()).replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean)
  if (!lines.length || cells(lines[0]).map((value) => value.toLowerCase()).join(",") !== headers.join(",")) return Response.json({ message: "Header CSV tidak sesuai template." }, { status: 400 })
  const valid: ReturnType<typeof residentData>[] = [], errors: { row: number; message: string }[] = []
  const seen = new Set<string>()
  lines.slice(1).forEach((line, index) => { try { const row = cells(line); if (row.length !== headers.length) throw new Error("Jumlah kolom tidak sesuai."); const data = Object.fromEntries(headers.map((header, column) => [header, row[column]])); const nationalId = data.nik; if (seen.has(nationalId)) throw new Error("NIK ganda di file impor."); seen.add(nationalId); valid.push(residentData(parseResidentInput({ nationalId, fullName: data.nama, familyCardNumber: data.nomor_kk, gender: data.jenis_kelamin, birthDate: data.tanggal_lahir, dusun: data.dusun, education: data.pendidikan, occupation: data.pekerjaan, isActive: data.status_aktif.toLowerCase() !== "nonaktif" }))) } catch (error) { errors.push({ row: index + 2, message: error instanceof Error ? error.message : "Baris tidak valid." }) } })
  if (errors.length) return Response.json({ created: 0, errors, message: "Impor dibatalkan. Perbaiki seluruh baris yang ditandai." }, { status: 400 })
  try { const result = await prisma.resident.createMany({ data: valid }); revalidatePath("/infografis"); await publishCmsUpdate("population"); return Response.json({ created: result.count, errors: [] }) }
  catch { return Response.json({ message: "Impor gagal. Pastikan tidak ada NIK yang sudah tersimpan." }, { status: 400 }) }
}
