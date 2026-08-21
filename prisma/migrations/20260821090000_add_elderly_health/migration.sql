CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'PETUGAS_PUSKESMAS');

ALTER TABLE "AdminUser" ADD COLUMN "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';

CREATE TABLE "Elderly" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dusun" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Elderly_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ElderlyDisease" (
    "id" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "diseaseName" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElderlyDisease_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PosyanduSession" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PosyanduSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PosyanduCheck" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "elderlyId" TEXT NOT NULL,
    "recordedById" TEXT NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL,
    "bloodGlucoseMgDl" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PosyanduCheck_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Elderly_isActive_dusun_fullName_idx" ON "Elderly"("isActive", "dusun", "fullName");
CREATE INDEX "ElderlyDisease_elderlyId_endedAt_idx" ON "ElderlyDisease"("elderlyId", "endedAt");
CREATE INDEX "ElderlyDisease_endedAt_normalizedName_idx" ON "ElderlyDisease"("endedAt", "normalizedName");
CREATE INDEX "PosyanduSession_sessionDate_idx" ON "PosyanduSession"("sessionDate");
CREATE UNIQUE INDEX "PosyanduCheck_sessionId_elderlyId_key" ON "PosyanduCheck"("sessionId", "elderlyId");
CREATE INDEX "PosyanduCheck_elderlyId_recordedAt_idx" ON "PosyanduCheck"("elderlyId", "recordedAt");
CREATE INDEX "PosyanduCheck_sessionId_recordedAt_idx" ON "PosyanduCheck"("sessionId", "recordedAt");

ALTER TABLE "ElderlyDisease" ADD CONSTRAINT "ElderlyDisease_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "Elderly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PosyanduSession" ADD CONSTRAINT "PosyanduSession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PosyanduCheck" ADD CONSTRAINT "PosyanduCheck_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PosyanduSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PosyanduCheck" ADD CONSTRAINT "PosyanduCheck_elderlyId_fkey" FOREIGN KEY ("elderlyId") REFERENCES "Elderly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PosyanduCheck" ADD CONSTRAINT "PosyanduCheck_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
