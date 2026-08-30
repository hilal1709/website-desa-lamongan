export type AuditLogRow = {
  id: string
  actorId: string | null
  action: string
  resource: string
  targetId: string | null
  createdAt: string
}

export type AuditLogTableProps = {
  rows: AuditLogRow[]
  page: number
  total: number
  pageSize: number
}
