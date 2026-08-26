import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { requireCmsPermission } from "@/lib/api-access"
import { publishCmsUpdate } from "@/lib/pusher"
import { defaultSiteSettings, getSiteRedirects, getSiteSettings, type FooterLink } from "@/lib/site-settings"

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : ""
const optionalUrl = (value: unknown) => {
  const url = text(value, 300)
  if (!url) return null
  try {
    const parsed = new URL(url)
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : null
  } catch {
    return null
  }
}
const validPath = (value: unknown) => { const path = text(value, 300); return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/admin") && !path.startsWith("/api") && !path.startsWith("/login") && !path.startsWith("/maintenance") && !/[?#]/.test(path) ? path : null }
const keywords = (value: unknown) => Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim().slice(0, 60)).filter(Boolean))].slice(0, 20) : []
const footerLinks = (value: unknown): FooterLink[] => Array.isArray(value) ? value.map((row) => row && typeof row === "object" ? { label: text((row as Record<string, unknown>).label, 60), href: validPath((row as Record<string, unknown>).href) } : null).filter((row): row is { label: string; href: string } => Boolean(row?.label && row.href)).slice(0, 10) : []

export async function GET() {
  const { response } = await requireCmsPermission("SETTINGS"); if (response) return response
  const [settings, redirects] = await Promise.all([getSiteSettings(), getSiteRedirects()])
  return NextResponse.json({ settings, redirects })
}

export async function PUT(request: Request) {
  const { response } = await requireCmsPermission("SETTINGS", "update"); if (response) return response
  try {
    const body = await request.json() as Record<string, unknown>
    const villageName = text(body.villageName, 120)
    const email = text(body.email, 160)
    if (!villageName) return NextResponse.json({ message: "Nama desa wajib diisi." }, { status: 400 })
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ message: "Alamat email tidak valid." }, { status: 400 })
    const socialUrls = [body.instagramUrl, body.facebookUrl, body.youtubeUrl].map(optionalUrl)
    if ([body.instagramUrl, body.facebookUrl, body.youtubeUrl].some((value, index) => text(value, 300) && !socialUrls[index])) return NextResponse.json({ message: "Tautan media sosial harus berupa URL http atau https yang valid." }, { status: 400 })
    const redirectRows = Array.isArray(body.redirects) ? body.redirects.map((row) => row && typeof row === "object" ? { source: validPath((row as Record<string, unknown>).source), destination: validPath((row as Record<string, unknown>).destination) } : null) : []
    if (redirectRows.some((row) => !row?.source || !row.destination || row.source === row.destination) || new Set(redirectRows.map((row) => row?.source)).size !== redirectRows.length) return NextResponse.json({ message: "Aturan redirect tidak valid." }, { status: 400 })
    const siteUrl = text(body.siteUrl, 240).replace(/\/$/, "")
    if (siteUrl && !optionalUrl(siteUrl)) return NextResponse.json({ message: "URL situs harus berupa URL http atau https yang valid." }, { status: 400 })
    const links = footerLinks(body.footerLinks)
    if (Array.isArray(body.footerLinks) && links.length !== body.footerLinks.length) return NextResponse.json({ message: "Link footer tidak valid." }, { status: 400 })
    const settings = {
      villageName, district: text(body.district, 120), regency: text(body.regency, 120), province: text(body.province, 120),
      officeAddress: text(body.officeAddress, 240), phone: text(body.phone, 80), email, serviceHours: text(body.serviceHours, 160),
      tagline: text(body.tagline, 320), instagramUrl: socialUrls[0], facebookUrl: socialUrls[1], youtubeUrl: socialUrls[2],
      siteTitle: text(body.siteTitle, 120) || villageName, siteDescription: text(body.siteDescription, 300),
      publicAnnouncement: text(body.publicAnnouncement, 500) || null,
      maintenanceMode: body.maintenanceMode === true, maintenanceMessage: text(body.maintenanceMessage, 500) || defaultSiteSettings.maintenanceMessage,
      footerLinks: links,
      siteUrl, seoKeywords: keywords(body.seoKeywords), seoImageUrl: optionalUrl(body.seoImageUrl), allowIndexing: body.allowIndexing !== false, googleVerification: text(body.googleVerification, 240) || null,
    }
    const saved = await prisma.$transaction(async (tx) => {
      const site = await tx.siteSetting.upsert({ where: { id: 1 }, update: settings, create: { id: 1, ...defaultSiteSettings, ...settings } })
      await tx.siteRedirect.deleteMany()
      if (redirectRows.length) await tx.siteRedirect.createMany({ data: redirectRows.map((row) => ({ source: row!.source!, destination: row!.destination! })) })
      return site
    })
    revalidatePath("/", "layout")
    await publishCmsUpdate("settings")
    return NextResponse.json({ settings: (({ id: _id, updatedAt: _updatedAt, ...data }) => data)(saved), redirects: await getSiteRedirects() })
  } catch (error) {
    console.error("Unable to save system settings", error)
    return NextResponse.json({ message: "Pengaturan tidak dapat disimpan. Coba lagi." }, { status: 500 })
  }
}
