ALTER TYPE "CmsModule" ADD VALUE IF NOT EXISTS 'ACCOUNT_ACCESS';
ALTER TYPE "CmsModule" ADD VALUE IF NOT EXISTS 'ACCOUNT_SECURITY';
ALTER TYPE "CmsModule" ADD VALUE IF NOT EXISTS 'AUDIT_LOG';

INSERT INTO "RolePermission" ("id", "roleId", "module", "canView", "canCreate", "canUpdate", "canDelete")
VALUES
  ('admin-account-access', 'system-administrator', 'ACCOUNT_ACCESS', true, true, true, true),
  ('admin-account-security', 'system-administrator', 'ACCOUNT_SECURITY', true, false, false, false),
  ('admin-audit-log', 'system-administrator', 'AUDIT_LOG', true, false, false, false)
ON CONFLICT ("roleId", "module") DO NOTHING;
