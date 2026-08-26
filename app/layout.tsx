import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteShell } from "@/components/layout/site-shell"
import { prisma } from "@/app/lib/prisma"
import { getSiteSettings } from "@/lib/site-settings"
import type { Viewport } from "next"

// Public content is maintained through the CMS. Render at request time so a
// refresh triggered by the CMS update signal always reads the latest database
// values on Vercel as well as in local development.
export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const metadataBase = settings.siteUrl ? new URL(settings.siteUrl) : undefined
  return {
  metadataBase, title: settings.siteTitle, description: settings.siteDescription, keywords: settings.seoKeywords,
  robots: settings.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  verification: settings.googleVerification ? { google: settings.googleVerification } : undefined,
  openGraph: { type: "website", locale: "id_ID", title: settings.siteTitle, description: settings.siteDescription, images: settings.seoImageUrl ? [{ url: settings.seoImageUrl }] : undefined },
  twitter: { card: "summary_large_image", title: settings.siteTitle, description: settings.siteDescription, images: settings.seoImageUrl ? [settings.seoImageUrl] : undefined },
  icons: {
    icon: [
      {
        url: "/images/logokedungrejo.png",
        type: "image/png",
      },
    ],
  },
  }
}

export const viewport: Viewport = {
  themeColor: "#061d20",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [disasterSetting, siteSettings] = await Promise.all([
    prisma.disasterSetting.findUnique({ where: { id: 1 }, select: { announcement: true, override: true } }),
    getSiteSettings(),
  ])

  return (
    <html lang="id">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <SiteShell disasterSetting={disasterSetting} siteSettings={siteSettings}>{children}</SiteShell>
      </body>
    </html>
  )
}
