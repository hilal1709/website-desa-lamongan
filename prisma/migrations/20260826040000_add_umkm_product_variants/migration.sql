DO $$
DECLARE variant_type text;
BEGIN
  SELECT data_type INTO variant_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'UmkmProduct' AND column_name = 'variants';

  IF variant_type IS NULL THEN
    ALTER TABLE "UmkmProduct" ADD COLUMN "variants" JSONB NOT NULL DEFAULT '[]'::jsonb;
  ELSIF variant_type = 'ARRAY' THEN
    ALTER TABLE "UmkmProduct"
      ALTER COLUMN "variants" TYPE JSONB
      USING COALESCE(to_jsonb("variants"), '[]'::jsonb);
  END IF;
END $$;
