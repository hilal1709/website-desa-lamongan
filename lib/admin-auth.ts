import { createHash, randomBytes } from "crypto"
import { cookies } from "next/headers"

import { prisma } from "@/app/lib/prisma"
import { verifyPassword } from "@/lib/auth-password"

const SESSION_COOKIE = "kedungrejo_admin_session"
const SESSION_MAX_AGE = 60 * 60 * 8

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex")

export async function authenticateAdmin(identifier: string, password: string) {
  const account = await prisma.adminUser.findFirst({
    where: {
      isActive: true,
      OR: [
        { username: { equals: identifier, mode: "insensitive" } },
        { email: { equals: identifier, mode: "insensitive" } },
      ],
    },
  })

  if (!account || !(await verifyPassword(password, account.passwordHash))) return null
  return account
}

export async function createAdminSession(userId: string) {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  await prisma.adminSession.create({ data: { userId, tokenHash: hashToken(token), expiresAt } })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
}

export async function getCurrentAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, username: true, email: true, name: true, isActive: true } } },
  })

  if (!session || session.expiresAt <= new Date() || !session.user.isActive) {
    if (session) await prisma.adminSession.delete({ where: { id: session.id } })
    return null
  }

  return session.user
}

export async function endAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) await prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } })
  cookieStore.delete(SESSION_COOKIE)
}
