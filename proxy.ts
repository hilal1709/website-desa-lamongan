import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/app/lib/prisma"

const excluded = ["/admin", "/login", "/api", "/maintenance", "/_next"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
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
