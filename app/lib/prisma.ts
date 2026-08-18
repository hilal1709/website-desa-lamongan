import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

const cachedPrisma = globalForPrisma.prisma;
// Prisma Client is regenerated when the schema changes. In development, discard
// a cached client generated before a newly added model is available.
export const prisma = cachedPrisma && "adminUser" in cachedPrisma ? cachedPrisma : createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
