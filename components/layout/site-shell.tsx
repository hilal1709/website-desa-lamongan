"use client"

import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { PublicContentSync } from "./public-content-sync"

const Navbar = dynamic(() => import("./navbar").then((module) => module.Navbar))
const Footer = dynamic(() => import("./footer").then((module) => module.Footer))
const ScrollToTop = dynamic(() => import("./scroll-to-top").then((module) => module.ScrollToTop))

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) return <main className="min-h-screen bg-[#f3f7f3]">{children}</main>

  return (
    <>
      <ScrollToTop />
      <PublicContentSync />
      <Navbar />
      <main className="min-h-screen bg-[#f3f7f3]">{children}</main>
      <Footer />
    </>
  )
}
