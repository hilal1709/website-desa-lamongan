import "dotenv/config"
import { Pool } from "pg"

const sensitiveTables = [
  "AdminSession", "AdminUser", "AuditLog", "Child", "ChildHealthCheck",
  "CmsNewsStore", "CmsPageStore", "Complaint", "Document", "Elderly",
  "PopulationEvent", "Resident", "ServiceAttachment", "ServiceSubmission",
  "SiteSetting", "Umkm",
]
const publicAggregateTables = ["infographic_stats", "age_group_stats", "education_stats", "occupation_stats", "population_trends"]

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL wajib diisi.")

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL.includes("supabase.com") ? { rejectUnauthorized: false } : undefined })
let failed = false

async function canAnonRead(table) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    // SESSION AUTHORIZATION avoids the connected postgres role bypassing RLS.
    await client.query("SET LOCAL SESSION AUTHORIZATION anon")
    await client.query(`SELECT 1 FROM public."${table}" LIMIT 1`)
    return true
  } catch {
    return false
  } finally {
    await client.query("ROLLBACK").catch(() => undefined)
    client.release()
  }
}

try {
  for (const table of sensitiveTables) {
    const readable = await canAnonRead(table)
    console.log(`${table}: ${readable ? "FAIL (public)" : "PASS (denied)"}`)
    failed ||= readable
  }
  for (const table of publicAggregateTables) {
    const exists = await pool.query("SELECT to_regclass($1) IS NOT NULL AS exists", [`public.${table}`])
    if (!exists.rows[0].exists) {
      console.log(`${table}: SKIP (not present)`)
      continue
    }
    const readable = await canAnonRead(table)
    console.log(`${table}: ${readable ? "PASS (public aggregate)" : "FAIL (denied)"}`)
    failed ||= !readable
  }
} finally {
  await pool.end()
}

if (failed) process.exitCode = 1
