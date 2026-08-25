CREATE TYPE "DocumentVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

ALTER TABLE "Document"
  ADD COLUMN "visibility" "DocumentVisibility" NOT NULL DEFAULT 'PUBLIC',
  ADD COLUMN "originalName" TEXT,
  ADD COLUMN "mimeType" TEXT,
  ADD COLUMN "byteSize" INTEGER,
  ADD COLUMN "storagePath" TEXT;

CREATE INDEX "Document_visibility_uploadedAt_idx" ON "Document"("visibility", "uploadedAt");
