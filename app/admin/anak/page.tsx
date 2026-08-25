import { ChildHealthManager } from "@/components/anak/child-health-manager"
import { createAdminMetadata } from "@/lib/admin-metadata"
export const metadata = createAdminMetadata("Rekam Medis Anak & Balita", "Kelola rekam medis bayi, balita, dan posyandu KIA.")
export default function AdminChildHealthPage() { return <ChildHealthManager canManageAccounts /> }
