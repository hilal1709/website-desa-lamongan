UPDATE "RolePermission"
SET "canView" = true,
    "canCreate" = true,
    "canUpdate" = true,
    "canDelete" = true
WHERE "roleId" = 'system-health-staff'
  AND "module" = 'ELDERLY_HEALTH';
