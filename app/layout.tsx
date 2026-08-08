import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteShell } from "@/components/layout/site-shell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Desa Kedungrejo",
  description: "Website resmi Desa Kedungrejo",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={inter.className}><SiteShell>{children}</SiteShell></body>
    </html>
  )
}
