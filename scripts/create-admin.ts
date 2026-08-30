import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

import { assertPasswordPolicy, hashPassword } from "../lib/auth-password"

const username = process.env.ADMIN_USERNAME?.trim()
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD

if (!username || !email || !password) {
  throw new Error("Set ADMIN_USERNAME, ADMIN_EMAIL, dan ADMIN_PASSWORD sebelum menjalankan script ini.")
}

const adminUsername = username
const adminEmail = email
const adminPassword = password

const prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })) })

async function main() {
  assertPasswordPolicy(adminPassword)
  const passwordHash = await hashPassword(adminPassword)
  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: { email: adminEmail, passwordHash, isActive: true, isSuperAdmin: true },
    create: { username: adminUsername, email: adminEmail, passwordHash, isSuperAdmin: true, mfaEnrollmentDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), roles: { create: { roleId: "system-administrator" } } },
  })
  console.log(`Admin ${adminUsername} siap digunakan.`)
}

main().finally(() => prisma.$disconnect())
