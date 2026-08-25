CREATE TYPE "CmsModule" AS ENUM (
  'DASHBOARD', 'INFOGRAPHICS', 'ELDERLY_HEALTH', 'UMKM', 'DISASTER_WEATHER',
  'PAGE_CONTENT', 'NEWS', 'DOCUMENT_ARCHIVE', 'SERVICE_CATALOG',
  'SERVICE_SUBMISSIONS', 'COMPLAINTS', 'CMS_MODULES', 'SETTINGS'
);

ALTER TABLE "AdminUser" ADD COLUMN "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "Role" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isSystem" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

CREATE TABLE "AdminUserRole" (
  "userId" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  CONSTRAINT "AdminUserRole_pkey" PRIMARY KEY ("userId", "roleId")
);
CREATE INDEX "AdminUserRole_roleId_idx" ON "AdminUserRole"("roleId");

CREATE TABLE "RolePermission" (
  "id" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  "module" "CmsModule" NOT NULL,
  "canView" BOOLEAN NOT NULL DEFAULT false,
  "canCreate" BOOLEAN NOT NULL DEFAULT false,
  "canUpdate" BOOLEAN NOT NULL DEFAULT false,
  "canDelete" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RolePermission_roleId_module_key" ON "RolePermission"("roleId", "module");
CREATE INDEX "RolePermission_module_idx" ON "RolePermission"("module");

INSERT INTO "Role" ("id", "name", "description", "isSystem", "updatedAt") VALUES
  ('system-administrator', 'Administrator', 'Akses penuh CMS untuk administrator lama.', true, CURRENT_TIMESTAMP),
  ('system-health-staff', 'Petugas Puskesmas', 'Akses rekam medis dan posyandu.', true, CURRENT_TIMESTAMP);

INSERT INTO "AdminUserRole" ("userId", "roleId")
SELECT "id", CASE WHEN "role" = 'PETUGAS_PUSKESMAS' THEN 'system-health-staff' ELSE 'system-administrator' END
FROM "AdminUser";

UPDATE "AdminUser" SET "isSuperAdmin" = true WHERE "role" = 'ADMIN';

INSERT INTO "RolePermission" ("id", "roleId", "module", "canView", "canCreate", "canUpdate", "canDelete")
SELECT 'admin-' || "enum"::text, 'system-administrator', "enum", true, true, true, true FROM unnest(enum_range(NULL::"CmsModule")) AS "enum";
INSERT INTO "RolePermission" ("id", "roleId", "module", "canView", "canCreate", "canUpdate", "canDelete")
VALUES ('health-elderly', 'system-health-staff', 'ELDERLY_HEALTH', true, true, true, false);

ALTER TABLE "AdminUser" DROP COLUMN "role";
DROP TYPE "AdminRole";

ALTER TABLE "AdminUserRole" ADD CONSTRAINT "AdminUserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdminUserRole" ADD CONSTRAINT "AdminUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
