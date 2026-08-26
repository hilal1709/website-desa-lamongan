import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { SystemSettingsManager } from "@/components/admin/system-settings-manager"
import { FooterLinksManager } from "@/components/admin/footer-links-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { getSiteRedirects, getSiteSettings } from "@/lib/site-settings"

export const metadata = createAdminMetadata("Pengaturan sistem", "Tinjau status dan pembaruan data CMS Desa Kedungrejo.")

export default async function PengaturanPage() {
  const [settings, redirects] = await Promise.all([getSiteSettings(), getSiteRedirects()])
  return <section data-admin-reveal aria-labelledby="pengaturan-sistem-title" className="py-1 sm:py-2"><AdminPageHeader eyebrow="CMS Desa" title="Pengaturan sistem" description="Atur identitas desa, maintenance, SEO, dan informasi publik website." /><SystemSettingsManager initialSettings={settings} initialRedirects={redirects} /><FooterLinksManager initialSettings={settings} initialRedirects={redirects} /></section>
}
