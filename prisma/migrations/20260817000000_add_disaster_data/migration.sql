CREATE TYPE "DisasterLocationType" AS ENUM ('EVAKUASI', 'RAWAN', 'POSKO');

CREATE TABLE "DisasterSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "override" TEXT NOT NULL DEFAULT 'auto',
    "announcement" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisasterSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DisasterLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "DisasterLocationType" NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisasterLocation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DisasterLocation_isActive_type_idx" ON "DisasterLocation"("isActive", "type");
