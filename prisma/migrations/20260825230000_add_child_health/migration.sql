CREATE TABLE "Child" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "gender" TEXT NOT NULL,
  "dusun" TEXT NOT NULL,
  "birthDate" TIMESTAMP(3) NOT NULL,
  "address" TEXT NOT NULL,
  "guardianName" TEXT NOT NULL,
  "guardianPhone" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "publicProfileConsent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Child_isActive_dusun_fullName_idx" ON "Child"("isActive", "dusun", "fullName");

CREATE TABLE "ChildPosyanduSession" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sessionDate" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ChildPosyanduSession_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ChildPosyanduSession_sessionDate_idx" ON "ChildPosyanduSession"("sessionDate");
ALTER TABLE "ChildPosyanduSession" ADD CONSTRAINT "ChildPosyanduSession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ChildHealthCheck" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "childId" TEXT NOT NULL,
  "recordedById" TEXT NOT NULL,
  "weightKg" DOUBLE PRECISION NOT NULL,
  "heightCm" DOUBLE PRECISION NOT NULL,
  "headCircumferenceCm" DOUBLE PRECISION,
  "feeding" TEXT,
  "interventions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "developmentStatus" TEXT,
  "notes" TEXT,
  "referral" TEXT,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ChildHealthCheck_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ChildHealthCheck_sessionId_childId_key" ON "ChildHealthCheck"("sessionId", "childId");
CREATE INDEX "ChildHealthCheck_childId_recordedAt_idx" ON "ChildHealthCheck"("childId", "recordedAt");
CREATE INDEX "ChildHealthCheck_sessionId_recordedAt_idx" ON "ChildHealthCheck"("sessionId", "recordedAt");
ALTER TABLE "ChildHealthCheck" ADD CONSTRAINT "ChildHealthCheck_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChildPosyanduSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChildHealthCheck" ADD CONSTRAINT "ChildHealthCheck_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChildHealthCheck" ADD CONSTRAINT "ChildHealthCheck_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
