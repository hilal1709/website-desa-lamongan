import { createHash, randomBytes } from "crypto"
import { cookies } from "next/headers"
import { cache } from "react"

import { prisma } from "@/app/lib/prisma"
import { verifyPassword } from "@/lib/auth-password"
import { canAccess, type CurrentAdmin, type PermissionAction } from "@/lib/access-control"
import { audit } from "@/lib/audit-log"
import { decryptTotpSecret, verifyTotp } from "@/lib/totp"

const SESSION_COOKIE = "kedungrejo_admin_session"
const SESSION_MAX_AGE = 60 * 60 * 8
const MAX_ACTIVE_SESSIONS = 3
const hashRecoveryCode = (code: string) => createHash("sha256").update(code.replace(/[^A-Za-z0-9]/g, "").toUpperCase()).digest("hex")

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

export function verifyAdminTotp(encryptedSecret: string | null, code: string) {
  if (!encryptedSecret) return false
  try { return verifyTotp(decryptTotpSecret(encryptedSecret), code) } catch { return false }
}

export function createRecoveryCodes() { return Array.from({ length: 10 }, () => randomBytes(6).toString("hex").toUpperCase().match(/.{1,4}/g)!.join("-")) }
export const recoveryCodeHash = hashRecoveryCode
export async function consumeRecoveryCode(userId: string, code: string) {
  const used = await prisma.mfaRecoveryCode.updateMany({ where: { userId, codeHash: hashRecoveryCode(code), usedAt: null }, data: { usedAt: new Date() } })
  return used.count === 1
}

export async function createAdminSession(userId: string) {
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  await prisma.$transaction(async (tx) => {
    await tx.adminSession.deleteMany({ where: { userId, expiresAt: { lte: new Date() } } })
    const excess = await tx.adminSession.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, skip: MAX_ACTIVE_SESSIONS - 1, select: { id: true } })
    if (excess.length) await tx.adminSession.deleteMany({ where: { id: { in: excess.map((session) => session.id) } } })
    await tx.adminSession.create({ data: { userId, tokenHash: hashToken(token), expiresAt } })
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
}

export async function getCurrentAdmin(options: { allowMfaEnrollment?: boolean } = {}) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { select: { id: true, username: true, email: true, name: true, isSuperAdmin: true, isActive: true, mfaSecret: true, mfaEnabledAt: true, mfaEnrollmentDeadline: true, roles: { include: { role: { include: { permissions: true } } } } } } },
  })

  if (!session || session.expiresAt <= new Date() || !session.user.isActive) {
    if (session) await prisma.adminSession.delete({ where: { id: session.id } })
    return null
  }

  const sensitiveModules = new Set(["INFOGRAPHICS", "ELDERLY_HEALTH", "SERVICE_SUBMISSIONS", "DOCUMENT_ARCHIVE", "COMPLAINTS"])
  const mfaRequired = session.user.isSuperAdmin || session.user.roles.some(({ role }) => role.permissions.some((permission) => sensitiveModules.has(permission.module) && (permission.canView || permission.canCreate || permission.canUpdate || permission.canDelete)))
  const enrollmentOverdue = mfaRequired && !session.user.mfaSecret && (!session.user.mfaEnrollmentDeadline || session.user.mfaEnrollmentDeadline <= new Date())
  if (enrollmentOverdue && !options.allowMfaEnrollment) return null
  return { id: session.user.id, username: session.user.username, email: session.user.email, name: session.user.name, isSuperAdmin: session.user.isSuperAdmin, isActive: session.user.isActive, roles: session.user.roles, mfaRequired, mfaEnrollmentOverdue: enrollmentOverdue, mfaEnabled: Boolean(session.user.mfaSecret), mfaEnabledAt: session.user.mfaEnabledAt?.toISOString() ?? null, mfaEnrollmentDeadline: session.user.mfaEnrollmentDeadline?.toISOString() ?? null } as CurrentAdmin
}

// React.cache only lives for the current server render. It avoids querying the same
// authenticated session again when the admin layout and a protected page need it.
export const getMfaEnrollmentAdmin = cache(() => getCurrentAdmin({ allowMfaEnrollment: true }))

export async function getCurrentHealthUser(action: PermissionAction = "view") {
  const user = await getCurrentAdmin()
  if (!user) return null
  if (!canAccess(user, "ELDERLY_HEALTH", action)) return null
  if (action !== "view") await audit("HEALTH_MUTATION_AUTHORIZED", "ELDERLY_HEALTH", { actorId: user.id })
  return user
}

export function isSuperAdmin(user: CurrentAdmin | null | undefined) {
  return user?.isSuperAdmin === true
}

export function hasAdminRole(user: CurrentAdmin | null | undefined) { return isSuperAdmin(user) }

export async function endAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) await prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } })
  cookieStore.delete(SESSION_COOKIE)
}
