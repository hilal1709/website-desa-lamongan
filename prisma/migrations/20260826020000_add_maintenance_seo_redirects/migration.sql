ALTER TABLE "SiteSetting"
  ADD COLUMN "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "maintenanceMessage" TEXT NOT NULL DEFAULT 'Website sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.',
  ADD COLUMN "siteUrl" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "seoKeywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "seoImageUrl" TEXT,
  ADD COLUMN "allowIndexing" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "googleVerification" TEXT;

CREATE TABLE "SiteRedirect" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteRedirect_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SiteRedirect_source_key" ON "SiteRedirect"("source");
