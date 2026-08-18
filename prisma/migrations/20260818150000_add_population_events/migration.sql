CREATE TYPE "PopulationEventType" AS ENUM ('KELAHIRAN', 'KEMATIAN', 'PINDAH_MASUK', 'PINDAH_KELUAR');

CREATE TABLE "PopulationOpeningBalance" (
    "id" TEXT NOT NULL,
    "dusun" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "totalPopulation" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PopulationOpeningBalance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PopulationEvent" (
    "id" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "type" "PopulationEventType" NOT NULL,
    "dusun" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "familyCardNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "residenceAddress" TEXT NOT NULL,
    "originAddress" TEXT,
    "destinationAddress" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PopulationEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PopulationOpeningBalance_dusun_key" ON "PopulationOpeningBalance"("dusun");
CREATE INDEX "PopulationEvent_eventDate_dusun_type_idx" ON "PopulationEvent"("eventDate", "dusun", "type");
CREATE INDEX "PopulationEvent_dusun_eventDate_idx" ON "PopulationEvent"("dusun", "eventDate");
