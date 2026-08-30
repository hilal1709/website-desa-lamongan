import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { clientAddress, isRateLimitedDistributed } from "@/lib/rate-limit"

const excluded = ["/admin", "/login", "/api", "/maintenance", "/_next"]

function apiRateProfile(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === "/api/layanan/pengajuan" && request.method === "POST") return { key: "public-service-submission", max: 5, windowMs: 15 * 60 * 1000 }
  if (pathname === "/api/aduan" && request.method === "POST") return { key: "public-complaint", max: 10, windowMs: 15 * 60 * 1000 }
  if (pathname === "/api/layanan/lacak") return { key: "public-service-tracking", max: 20, windowMs: 15 * 60 * 1000 }
  if (pathname.startsWith("/api/admin/") || pathname.startsWith("/api/cms/") || pathname.startsWith("/api/kesehatan/")) return { key: "admin-api", max: 240, windowMs: 15 * 60 * 1000 }
  if (pathname.startsWith("/api/")) return { key: "public-api", max: 120, windowMs: 60 * 1000 }
  return null
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Cookies can authenticate a state-changing request. Reject requests made
  // from another origin before they reach any route handler or Server Action.
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin")
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: "Permintaan lintas situs ditolak." }, { status: 403 })
    }
  }
  const profile = apiRateProfile(request)
  if (profile && await isRateLimitedDistributed(`${profile.key}:${clientAddress(request.headers)}`, profile.max, profile.windowMs)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan. Silakan coba lagi nanti." }, { status: 429, headers: { "Retry-After": String(Math.ceil(profile.windowMs / 1000)) } })
  }
  if (excluded.some((path) => pathname === path || pathname.startsWith(`${path}/`)) || /\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next()
  const [settings, redirect] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 }, select: { maintenanceMode: true } }),
    prisma.siteRedirect.findUnique({ where: { source: pathname }, select: { destination: true } }),
  ])
  if (settings?.maintenanceMode) return NextResponse.rewrite(new URL("/maintenance", request.url))
  if (redirect) return NextResponse.redirect(new URL(redirect.destination, request.url), 308)
  return NextResponse.next()
}

export const config = { matcher: "/((?!_next/static|_next/image|favicon.ico).*)" }
