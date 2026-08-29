export type Permission = { module: string; canView: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean }
export type PermissionAction = keyof Omit<Permission, "module">
export type AccessModule = { id: string; label: string; group: string; description: string; actions: readonly PermissionAction[] }
export type AccessRole = { id: string; name: string; description: string | null; isSystem: boolean; permissions: Permission[]; _count: { users: number } }
export type AccessUser = { id: string; username: string; email: string; name: string | null; isActive: boolean; isSuperAdmin: boolean; roles: { roleId: string }[] }
export type RoleForm = { name: string; description: string; permissions: Permission[] }
export type UserForm = { username: string; email: string; name: string; password: string; roleIds: string[]; isActive: boolean }
export type Notice = { message: string; variant: "success" | "error" }
export type DeleteTarget = { kind: "role" | "user"; id: string; name: string }

export const emptyRole = (): RoleForm => ({ name: "", description: "", permissions: [] })
export const emptyUser = (): UserForm => ({ username: "", email: "", name: "", password: "", roleIds: [], isActive: true })
export const permissionOptions = [
  { key: "canView", label: "Lihat", tone: "bg-sky-50 text-sky-700 ring-sky-200" },
  { key: "canCreate", label: "Tambah", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  { key: "canUpdate", label: "Ubah", tone: "bg-amber-50 text-amber-700 ring-amber-200" },
  { key: "canDelete", label: "Hapus", tone: "bg-rose-50 text-rose-700 ring-rose-200" },
] as const
