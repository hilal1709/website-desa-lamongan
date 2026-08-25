CREATE TYPE "ServiceSubmissionStatusType" AS ENUM ('DIAJUKAN', 'DIVERIFIKASI', 'PERLU_DILENGKAPI', 'DITOLAK', 'SIAP_DIAMBIL', 'SELESAI');

CREATE TABLE "VillageService" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'description',
    "estimatedTime" TEXT NOT NULL DEFAULT '1-2 hari kerja',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VillageService_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceRequirement" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ServiceRequirement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceSubmission" (
    "id" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" "ServiceSubmissionStatusType" NOT NULL DEFAULT 'DIAJUKAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceAttachment" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "requirementId" TEXT,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceAttachment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceSubmissionStatus" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "status" "ServiceSubmissionStatusType" NOT NULL,
    "note" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ServiceSubmissionStatus_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VillageService_slug_key" ON "VillageService"("slug");
CREATE INDEX "VillageService_isActive_order_idx" ON "VillageService"("isActive", "order");
CREATE INDEX "ServiceRequirement_serviceId_order_idx" ON "ServiceRequirement"("serviceId", "order");
CREATE UNIQUE INDEX "ServiceSubmission_trackingCode_key" ON "ServiceSubmission"("trackingCode");
CREATE INDEX "ServiceSubmission_serviceId_status_createdAt_idx" ON "ServiceSubmission"("serviceId", "status", "createdAt");
CREATE INDEX "ServiceSubmission_whatsapp_trackingCode_idx" ON "ServiceSubmission"("whatsapp", "trackingCode");
CREATE INDEX "ServiceAttachment_submissionId_idx" ON "ServiceAttachment"("submissionId");
CREATE INDEX "ServiceSubmissionStatus_submissionId_createdAt_idx" ON "ServiceSubmissionStatus"("submissionId", "createdAt");

ALTER TABLE "ServiceRequirement" ADD CONSTRAINT "ServiceRequirement_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "VillageService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceSubmission" ADD CONSTRAINT "ServiceSubmission_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "VillageService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ServiceAttachment" ADD CONSTRAINT "ServiceAttachment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ServiceSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceSubmissionStatus" ADD CONSTRAINT "ServiceSubmissionStatus_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ServiceSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceSubmissionStatus" ADD CONSTRAINT "ServiceSubmissionStatus_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
