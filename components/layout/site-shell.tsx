"use client"

import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { PublicContentSync } from "./public-content-sync"
import { DisasterAnnouncementBanner } from "./disaster-announcement-banner"
import { CmsPublicUpdateNotifier } from "@/components/admin/cms-public-update-notifier"
import { InstallAppPrompt } from "./install-app-prompt"
import { PublicAnnouncementBanner } from "./public-announcement-banner"
import type { SiteSettings } from "@/lib/site-settings"

const Navbar = dynamic(() => import("./navbar").then((module) => module.Navbar))
const Footer = dynamic(() => import("./footer").then((module) => module.Footer))
const ScrollToTop = dynamic(() => import("./scroll-to-top").then((module) => module.ScrollToTop))

type DisasterSetting = { announcement: string | null; override: string } | null

export function SiteShell({ children, disasterSetting, siteSettings }: { children: React.ReactNode; disasterSetting: DisasterSetting; siteSettings: SiteSettings }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const isMaintenance = pathname === "/maintenance"

  if (isAdmin) return <><CmsPublicUpdateNotifier /><main className="min-h-screen bg-[#f3f7f3]">{children}</main></>
  if (isMaintenance) return <>{children}</>

  return (
    <>
      <ScrollToTop />
      <PublicContentSync />
      <InstallAppPrompt />
      <Navbar />
      <DisasterAnnouncementBanner initialSetting={disasterSetting} />
      <PublicAnnouncementBanner initialAnnouncement={siteSettings.publicAnnouncement} />
      <main className="min-h-screen bg-[#f3f7f3]">{children}</main>
      <Footer settings={siteSettings} />
    </>
  )
}
