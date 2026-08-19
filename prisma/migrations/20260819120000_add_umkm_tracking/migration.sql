ALTER TABLE "Umkm" ADD COLUMN "dusun" TEXT NOT NULL DEFAULT 'Belum ditentukan';
ALTER TABLE "Umkm" ADD COLUMN "registeredAt" TIMESTAMP(3);

UPDATE "Umkm" SET "registeredAt" = "createdAt" WHERE "registeredAt" IS NULL;

ALTER TABLE "Umkm" ALTER COLUMN "registeredAt" SET NOT NULL;
ALTER TABLE "Umkm" ALTER COLUMN "registeredAt" SET DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX "Umkm_isPublished_dusun_registeredAt_idx" ON "Umkm"("isPublished", "dusun", "registeredAt");
