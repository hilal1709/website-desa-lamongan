import { ElderlyHealthManager } from "@/components/lansia/elderly-health-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"

export const metadata = createAdminMetadata("Rekam Medis Lansia", "Kelola rekam medis lansia dan posyandu digital.")

export default function AdminElderlyHealthPage() {
  return <ElderlyHealthManager canManageAccounts />
}
