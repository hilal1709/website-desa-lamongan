-- The household total is intentionally nullable for existing balances. It must
-- be completed by an administrator from the official per-hamlet source.
ALTER TABLE "PopulationOpeningBalance" ADD COLUMN "totalHouseholds" INTEGER;
