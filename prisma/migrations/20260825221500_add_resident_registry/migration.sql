CREATE TABLE "Resident" (
    "id" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "familyCardNumber" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "dusun" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PopulationEvent" ADD COLUMN "residentId" TEXT;

CREATE UNIQUE INDEX "Resident_nationalId_key" ON "Resident"("nationalId");
CREATE INDEX "Resident_isActive_dusun_idx" ON "Resident"("isActive", "dusun");
CREATE INDEX "Resident_isActive_education_idx" ON "Resident"("isActive", "education");
CREATE INDEX "Resident_isActive_occupation_idx" ON "Resident"("isActive", "occupation");
CREATE INDEX "Resident_familyCardNumber_idx" ON "Resident"("familyCardNumber");
CREATE INDEX "PopulationEvent_residentId_idx" ON "PopulationEvent"("residentId");

ALTER TABLE "PopulationEvent" ADD CONSTRAINT "PopulationEvent_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE SET NULL ON UPDATE CASCADE;
