import { PopulationEventManager } from "@/components/infografis/population-event-manager"
import { ResidentManager } from "@/components/infografis/resident-manager"
import { AdminPageHeader } from "@/components/admin/admin-page-header"

export const metadata = { title: "Kelola Infografis | Admin Kedungrejo" }

export default function AdminInfografisPage() { return <section data-admin-reveal aria-label="Kependudukan dan infografis" className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Kependudukan" title="Kependudukan & infografis" description="Kelola angka penduduk resmi melalui data dasar dan peristiwa. Profil warga dipakai khusus untuk visual pendidikan serta mata pencaharian." backHref="/admin" /><div className="mt-5 space-y-6"><section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 text-sm leading-6 text-emerald-950 sm:p-6"><p className="font-black">Urutan pengelolaan</p><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Atur data dasar dan catat peristiwa untuk total penduduk resmi.</li><li>Lengkapi profil warga untuk grafik pendidikan dan mata pencaharian.</li></ol></section><PopulationEventManager /><ResidentManager /></div></section> }
