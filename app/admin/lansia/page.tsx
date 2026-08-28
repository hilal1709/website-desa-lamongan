import { ElderlyHealthManager } from "@/components/lansia/elderly-health-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"
import { getInitialElderlyHealthData } from "@/lib/elderly-health-admin-data"

export const metadata = createAdminMetadata("Rekam Medis Lansia", "Kelola rekam medis lansia dan posyandu digital.")

export default async function AdminElderlyHealthPage() {
  const data = await getInitialElderlyHealthData()
  return <ElderlyHealthManager canManageAccounts {...data} />
}
