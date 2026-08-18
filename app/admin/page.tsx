import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAdminDashboardData } from "@/lib/admin-data"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Dashboard", "Ringkasan operasional dan akses cepat pengelolaan CMS Desa Kedungrejo.")

export default async function Admin() {
  const { metrics, updatedAt } = await getAdminDashboardData()
  return <AdminDashboard metrics={metrics} updatedAt={updatedAt} />
}
