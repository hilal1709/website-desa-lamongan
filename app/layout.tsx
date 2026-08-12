import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SiteShell } from "@/components/layout/site-shell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Desa Kedungrejo",
  description: "Website resmi Desa Kedungrejo",
  icons: {
    icon: "/images/logokedungrejo.jpeg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
