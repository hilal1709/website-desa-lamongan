"use client"

import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { PublicContentSync } from "./public-content-sync"
import { DisasterAnnouncementBanner } from "./disaster-announcement-banner"
import { CmsPublicUpdateNotifier } from "@/components/admin/cms-public-update-notifier"
import { InstallAppPrompt } from "./install-app-prompt"

const Navbar = dynamic(() => import("./navbar").then((module) => module.Navbar))
const Footer = dynamic(() => import("./footer").then((module) => module.Footer))
const ScrollToTop = dynamic(() => import("./scroll-to-top").then((module) => module.ScrollToTop))

type DisasterSetting = { announcement: string | null; override: string } | null

export function SiteShell({ children, disasterSetting }: { children: React.ReactNode; disasterSetting: DisasterSetting }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) return <><CmsPublicUpdateNotifier /><main className="min-h-screen bg-[#f3f7f3]">{children}</main></>

  return (
    <>
      <ScrollToTop />
      <PublicContentSync />
      <InstallAppPrompt />
      <Navbar />
      <DisasterAnnouncementBanner initialSetting={disasterSetting} />
      <main className="min-h-screen bg-[#f3f7f3]">{children}</main>
      <Footer />
    </>
  )
}
