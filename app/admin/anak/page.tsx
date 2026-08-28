import { ChildHealthManager } from "@/components/anak/child-health-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { getInitialChildHealthData } from "@/lib/child-health-admin-data"
export const metadata = createAdminMetadata("Rekam Medis Anak & Balita", "Kelola rekam medis bayi, balita, dan posyandu KIA.")
export default async function AdminChildHealthPage() {
  const data = await getInitialChildHealthData()
  return <ChildHealthManager canManageAccounts {...data} />
}
