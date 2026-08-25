import "dotenv/config"
import { readFile } from "node:fs/promises"
import { createHash, randomUUID } from "node:crypto"
import { Pool } from "pg"

const migration = "20260825150000_add_role_based_access"
const file = new URL(`../prisma/migrations/${migration}/migration.sql`, import.meta.url)
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL?.includes("supabase.com") ? { rejectUnauthorized: false } : undefined })

async function main() {
  const sql = await readFile(file, "utf8")
  const present = await pool.query(`SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'AdminUser' AND column_name = 'isSuperAdmin'`)
  if (!present.rowCount) await pool.query(sql)
  const registered = await pool.query(`SELECT 1 FROM "_prisma_migrations" WHERE migration_name = $1`, [migration])
  if (!registered.rowCount) await pool.query(`INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) VALUES ($1, $2, NOW(), $3, NULL, NOW(), 1)`, [randomUUID(), createHash("sha256").update(sql).digest("hex"), migration])
  console.log(present.rowCount ? "Skema RBAC sudah tersedia." : "Skema RBAC berhasil diterapkan.")
}

main().finally(() => pool.end())
