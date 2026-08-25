import { ComplaintManager } from "@/components/admin/complaint-manager"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Kelola aduan", "Tinjau dan tindak lanjuti aduan warga.")

export default function AduanAdminPage() {
  return <section data-admin-reveal aria-labelledby="kelola-aduan-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="Layanan Desa" title="Kelola aduan" description="Tinjau laporan warga, beri tanggapan, dan perbarui status penanganannya." /><div className="mt-5"><ComplaintManager /></div></section>
}
