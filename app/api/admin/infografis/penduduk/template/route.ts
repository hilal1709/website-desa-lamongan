import { requireCmsPermission } from "@/lib/api-access"

export async function GET() {
  const access = await requireCmsPermission("INFOGRAPHICS"); if (access.response) return access.response
  const csv = "nik,nama,nomor_kk,jenis_kelamin,tanggal_lahir,dusun,pendidikan,pekerjaan,status_aktif\n3524000000000001,Contoh Warga,3524000000000002,Laki-laki,1990-01-01,Dusun Contoh,SMA/SMK/MA,Petani,aktif\n"
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=template-data-penduduk.csv" } })
}
