import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; prismaUsesTls?: boolean };
const databaseUrl = process.env.DATABASE_URL ?? "";
const usesTls = databaseUrl.includes("supabase.com") || databaseUrl.includes("sslmode=require");

function createPrismaClient() {
    const pool = new Pool({ connectionString: databaseUrl, ssl: usesTls ? { rejectUnauthorized: false } : undefined });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

const cachedPrisma = globalForPrisma.prisma;
// Prisma Client is regenerated when the schema changes. In development, discard
// a cached client generated before a newly added model is available.
export const prisma = cachedPrisma && "adminUser" in cachedPrisma && "umkm" in cachedPrisma && globalForPrisma.prismaUsesTls === usesTls ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") { globalForPrisma.prisma = prisma; globalForPrisma.prismaUsesTls = usesTls; }
