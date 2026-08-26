import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaSchemaVersion = "20260826040000_umkm_product_variants"
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; prismaUsesTls?: boolean; prismaSchemaVersion?: string };
const databaseUrl = process.env.DATABASE_URL ?? "";
const usesTls = databaseUrl.includes("supabase.com") || databaseUrl.includes("sslmode=require");

function createPrismaClient() {
    const pool = new Pool({ connectionString: databaseUrl, ssl: usesTls ? { rejectUnauthorized: false } : undefined });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

const cachedPrisma = globalForPrisma.prisma;
// In development, discard the cached client after schema changes so Turbopack
// cannot continue querying with an outdated generated Prisma Client.
export const prisma = cachedPrisma && "adminUser" in cachedPrisma && "role" in cachedPrisma && "rolePermission" in cachedPrisma && "umkm" in cachedPrisma && "resident" in cachedPrisma && "populationEvent" in cachedPrisma && "elderly" in cachedPrisma && "child" in cachedPrisma && "villageService" in cachedPrisma && "siteSetting" in cachedPrisma && "siteRedirect" in cachedPrisma && globalForPrisma.prismaUsesTls === usesTls && globalForPrisma.prismaSchemaVersion === prismaSchemaVersion ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") { globalForPrisma.prisma = prisma; globalForPrisma.prismaUsesTls = usesTls; globalForPrisma.prismaSchemaVersion = prismaSchemaVersion }
