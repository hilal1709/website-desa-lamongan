import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteShell } from "@/components/layout/site-shell"
import { prisma } from "@/app/lib/prisma"
import type { Viewport } from "next"

// Public content is maintained through the CMS. Render at request time so a
// refresh triggered by the CMS update signal always reads the latest database
// values on Vercel as well as in local development.
export const dynamic = "force-dynamic"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Desa Kedungrejo",
  description: "Website resmi Desa Kedungrejo",
  icons: {
    icon: [
      {
        url: "/images/logokedungrejo.png",
        type: "image/png",
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#061d20",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const disasterSetting = await prisma.disasterSetting.findUnique({ where: { id: 1 }, select: { announcement: true, override: true } })

  return (
    <html lang="id">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <SiteShell disasterSetting={disasterSetting}>{children}</SiteShell>
      </body>
    </html>
  )
}
