import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAdminDashboardData } from "@/lib/admin-data"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Dashboard", "Ringkasan operasional dan akses cepat pengelolaan CMS Desa Kedungrejo.")

export default async function Admin() {
  const { metrics, attention, activity, updatedAt } = await getAdminDashboardData()
  return <AdminDashboard metrics={metrics} attention={attention} activity={activity} updatedAt={updatedAt} />
}
