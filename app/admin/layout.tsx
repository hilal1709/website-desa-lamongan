import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminMotion } from "@/components/admin/admin-motion"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { redirect } from "next/navigation"
import { firstPermittedCmsPath } from "@/lib/access-control"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { default: "CMS Desa Kedungrejo", template: "%s | CMS Desa Kedungrejo" },
  description: "Ruang kerja internal untuk mengelola konten dan layanan Desa Kedungrejo.",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentAdmin()
  if (!user) redirect("/login")
  const destination = firstPermittedCmsPath(user)
  if (!destination) redirect("/posyandu-lansia")
  return <AdminMotion><div className="min-h-screen overflow-x-hidden bg-[#eef5ef] px-2 pb-6 pt-2 sm:px-5 sm:pb-8 sm:pt-3 lg:px-6"><div className="mx-auto max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-5"><AdminSidebar user={user} /><main id="main-content" className="min-w-0 lg:col-start-2">{children}</main></div></div></AdminMotion>
}
