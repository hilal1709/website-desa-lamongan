import "dotenv/config"
import { promises as fs } from "fs"
import path from "path"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import type { Prisma } from "../generated/prisma/client"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

async function main() {
  const root = process.cwd()
  const [pages, news] = await Promise.all([
    fs.readFile(path.join(root, "data", "cms-pages.json"), "utf8").then(JSON.parse),
    fs.readFile(path.join(root, "data", "cms-news.json"), "utf8").then(JSON.parse).catch(() => ({ categories: ["Pembangunan", "Pertanian", "Kesehatan"], articles: [] })),
  ])
  await prisma.cmsPageStore.upsert({ where: { id: 1 }, create: { id: 1, data: pages as Prisma.InputJsonValue }, update: { data: pages as Prisma.InputJsonValue } })
  await prisma.cmsNewsStore.upsert({ where: { id: 1 }, create: { id: 1, data: news as Prisma.InputJsonValue }, update: { data: news as Prisma.InputJsonValue } })
}
main().finally(async () => { await prisma.$disconnect(); await pool.end() })
