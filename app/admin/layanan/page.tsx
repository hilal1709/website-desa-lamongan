import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { ServiceManager } from "@/components/admin/service-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Layanan & pengajuan", "Kelola katalog layanan administrasi dan pengajuan warga.")
export default function AdminServicesPage() { return <section className="py-1 sm:py-2"><AdminPageHeader eyebrow="Layanan Desa" title="Layanan & pengajuan" description="Atur layanan publik dan tindak lanjuti pengajuan warga." /><div className="mt-5"><ServiceManager /></div></section> }
