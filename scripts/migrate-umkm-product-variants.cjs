require("dotenv").config({ path: ".env.local" })
require("dotenv").config({ path: ".env" })

const { Client } = require("pg")

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL belum dikonfigurasi.")
console.log("Memulai migrasi varian UMKM.")

const client = new Client({ connectionString: databaseUrl, ssl: databaseUrl.includes("supabase.com") ? { rejectUnauthorized: false } : undefined })

async function migrate() {
  await client.connect()
  await client.query(`
    DO $$
    DECLARE variant_type text;
    BEGIN
      SELECT data_type INTO variant_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'UmkmProduct' AND column_name = 'variants';
      IF variant_type IS NULL THEN
        ALTER TABLE "UmkmProduct" ADD COLUMN "variants" JSONB NOT NULL DEFAULT '[]'::jsonb;
      ELSIF variant_type = 'ARRAY' THEN
        ALTER TABLE "UmkmProduct" ALTER COLUMN "variants" TYPE JSONB USING COALESCE(to_jsonb("variants"), '[]'::jsonb);
      END IF;
    END $$;
  `)
  const result = await client.query(`SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'UmkmProduct' AND column_name = 'variants'`)
  console.log(`Migrasi varian UMKM selesai. Tipe kolom: ${result.rows[0]?.data_type ?? "tidak ditemukan"}.`)
}

;(async () => {
  try {
    await migrate()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  } finally {
    await client.end()
  }
})()
