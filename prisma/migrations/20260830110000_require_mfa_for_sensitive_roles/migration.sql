UPDATE "AdminUser" AS u
SET "mfaEnrollmentDeadline" = CURRENT_TIMESTAMP + INTERVAL '7 days'
WHERE u."mfaSecret" IS NULL AND u."mfaEnrollmentDeadline" IS NULL
  AND EXISTS (SELECT 1 FROM "AdminUserRole" aur JOIN "RolePermission" rp ON rp."roleId" = aur."roleId" WHERE aur."userId" = u.id AND rp.module IN ('INFOGRAPHICS', 'ELDERLY_HEALTH', 'SERVICE_SUBMISSIONS', 'DOCUMENT_ARCHIVE', 'COMPLAINTS') AND (rp."canView" OR rp."canCreate" OR rp."canUpdate" OR rp."canDelete"));
