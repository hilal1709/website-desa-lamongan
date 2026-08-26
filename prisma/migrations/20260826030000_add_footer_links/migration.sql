ALTER TABLE "SiteSetting" ADD COLUMN "footerLinks" JSONB NOT NULL DEFAULT '[]'::jsonb;
