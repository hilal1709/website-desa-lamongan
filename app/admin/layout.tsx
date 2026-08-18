import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getCurrentAdmin } from "@/lib/admin-auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!(await getCurrentAdmin())) redirect("/login")
  return <section className="min-h-screen bg-[#eef5ef] px-3 pb-8 pt-3 sm:px-5 lg:px-6"><div className="mx-auto max-w-[1500px] lg:grid lg:grid-cols-[280px_1fr] lg:gap-5"><AdminSidebar /><main className="min-w-0">{children}</main></div></section>
}
