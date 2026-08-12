import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { ScrollToTop } from "./scroll-to-top"

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen bg-[#f3f7f3]">{children}</main>
      <Footer />
    </>
  )
}
