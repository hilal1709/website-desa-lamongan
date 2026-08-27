import { AdminActivityPanel } from "@/components/admin/dashboard/dashboard-activity-panel"
import { AdminAttentionPanel } from "@/components/admin/dashboard/dashboard-attention-panel"
import { DashboardHero } from "@/components/admin/dashboard/dashboard-hero"
import { AdminMetricGrid } from "@/components/admin/dashboard/dashboard-metric-grid"
import { AdminQuickLinks } from "@/components/admin/dashboard/dashboard-quick-links"
import { AdminNotificationDialog } from "@/components/admin/admin-notification-dialog"
import type { AdminActivity, AdminAttentionGroup, AdminMetric } from "@/lib/admin-data"

export function AdminDashboard({ metrics, attention, activity, updatedAt }: { metrics: AdminMetric[]; attention: AdminAttentionGroup[]; activity: AdminActivity[]; updatedAt: string | null }) {
  return <section aria-labelledby="dashboard-cms-title" className="py-1 sm:py-2">
    {attention.some((group) => group.count > 0) ? <AdminNotificationDialog attention={attention} /> : null}
    <DashboardHero />
    <AdminAttentionPanel attention={attention} />
    <AdminMetricGrid metrics={metrics} />
    <AdminActivityPanel activity={activity} />
    {updatedAt ? <p data-admin-reveal className="mt-3 text-xs font-medium text-slate-500">Data CMS terakhir diperbarui: {updatedAt}</p> : null}
    <AdminQuickLinks />
  </section>
}
