import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteShell } from "@/components/layout/site-shell"
import { prisma } from "@/app/lib/prisma"

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
