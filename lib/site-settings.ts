import { prisma } from "@/app/lib/prisma"

export type SiteSettings = {
  villageName: string; district: string; regency: string; province: string; officeAddress: string; phone: string; email: string; serviceHours: string
  tagline: string; instagramUrl: string | null; facebookUrl: string | null; youtubeUrl: string | null; siteTitle: string; siteDescription: string; publicAnnouncement: string | null
  maintenanceMode: boolean; maintenanceMessage: string; siteUrl: string; seoKeywords: string[]; seoImageUrl: string | null; allowIndexing: boolean; googleVerification: string | null; footerLinks: FooterLink[]
}
export type SiteRedirectRule = { id: string; source: string; destination: string }
export type FooterLink = { label: string; href: string }

export const defaultSiteSettings: SiteSettings = {
  villageName: "Desa Kedungrejo",
  district: "Kecamatan Modo",
  regency: "Kabupaten Lamongan",
  province: "Jawa Timur",
  officeAddress: "Jl. Raya Kedungrejo No. 01",
  phone: "",
  email: "",
  serviceHours: "",
  tagline: "Mewujudkan pelayanan publik yang terbuka, tanggap, dan dekat dengan warga.",
  instagramUrl: null,
  facebookUrl: null,
  youtubeUrl: null,
  siteTitle: "Desa Kedungrejo",
  siteDescription: "Website resmi Desa Kedungrejo",
  publicAnnouncement: null,
  maintenanceMode: false, maintenanceMessage: "Website sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.", siteUrl: "", seoKeywords: [], seoImageUrl: null, allowIndexing: true, googleVerification: null,
  footerLinks: [{ label: "Profil Desa", href: "/profil" }, { label: "Berita Desa", href: "/berita" }, { label: "Layanan Publik", href: "/layanan" }, { label: "Data Desa", href: "/infografis" }],
}

export async function getSiteRedirects(): Promise<SiteRedirectRule[]> {
  return prisma.siteRedirect.findMany({ select: { id: true, source: true, destination: true }, orderBy: { source: "asc" } })
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const setting = await prisma.siteSetting.findUnique({ where: { id: 1 } })
  if (!setting) return { ...defaultSiteSettings }
  const { id: _id, updatedAt: _updatedAt, ...data } = setting
  const rawLinks: unknown[] = Array.isArray(setting.footerLinks) ? setting.footerLinks : defaultSiteSettings.footerLinks
  return { ...data, footerLinks: rawLinks.filter((link): link is FooterLink => Boolean(link && typeof link === "object" && typeof (link as FooterLink).label === "string" && typeof (link as FooterLink).href === "string")) }
}
