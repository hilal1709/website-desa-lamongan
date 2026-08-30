import { cookies } from "next/headers"

import { prisma } from "@/app/lib/prisma"
import { authenticateAdmin, createRecoveryCodes, getCurrentAdmin, recoveryCodeHash, verifyAdminTotp } from "@/lib/admin-auth"
import { audit } from "@/lib/audit-log"
import { clientAddress } from "@/lib/rate-limit"
import { createTotpSecret, decryptTotpSecret, encryptTotpSecret, totpUri, verifyTotp } from "@/lib/totp"

const ENROLLMENT_COOKIE = "kedungrejo_admin_mfa_enrollment"
const ENROLLMENT_MAX_AGE = 10 * 60

async function superadmin() {
  const user = await getCurrentAdmin({ allowMfaEnrollment: true })
  if (!user) return { user: null, response: Response.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 }) }
  if (!user.mfaRequired) return { user: null, response: Response.json({ error: "MFA hanya diperlukan untuk akun yang mengakses data sensitif." }, { status: 403 }) }
  return { user, response: null }
}

function configurationError(error: unknown) {
  return error instanceof Error && error.message.includes("MFA_ENCRYPTION_KEY")
}

export async function GET() {
  const access = await superadmin(); if (access.response) return access.response
  const account = await prisma.adminUser.findUnique({ where: { id: access.user!.id }, select: { mfaSecret: true, mfaEnabledAt: true, mfaEnrollmentDeadline: true } })
  return Response.json({ enabled: Boolean(account?.mfaSecret), enabledAt: account?.mfaEnabledAt?.toISOString() ?? null, enrollmentDeadline: account?.mfaEnrollmentDeadline?.toISOString() ?? null, configured: Boolean(process.env.MFA_ENCRYPTION_KEY) })
}

export async function POST(request: Request) {
  const access = await superadmin(); if (access.response) return access.response
  try {
    const body = await request.json() as Record<string, unknown>
    const action = body.action
    const cookieStore = await cookies()
    if (action === "start") {
      const secret = createTotpSecret()
      cookieStore.set(ENROLLMENT_COOKIE, encryptTotpSecret(JSON.stringify({ userId: access.user!.id, secret, expiresAt: Date.now() + ENROLLMENT_MAX_AGE * 1000 })), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: ENROLLMENT_MAX_AGE })
      return Response.json({ secret, uri: totpUri(secret, access.user!.email) })
    }

    const password = typeof body.password === "string" ? body.password : ""
    const code = typeof body.code === "string" ? body.code : ""
    const account = await authenticateAdmin(access.user!.email, password)
    if (!account || account.id !== access.user!.id) return Response.json({ error: "Kata sandi tidak valid." }, { status: 400 })

    if (action === "confirm") {
      const raw = cookieStore.get(ENROLLMENT_COOKIE)?.value
      if (!raw) return Response.json({ error: "Sesi pengaturan MFA telah berakhir. Mulai lagi." }, { status: 400 })
      const pending = JSON.parse(decryptTotpSecret(raw)) as { userId: string; secret: string; expiresAt: number }
      if (pending.userId !== access.user!.id || pending.expiresAt < Date.now() || !verifyTotp(pending.secret, code)) return Response.json({ error: "Kode autentikator tidak valid atau sesi telah berakhir." }, { status: 400 })
      const recoveryCodes = createRecoveryCodes()
      await prisma.$transaction([
        prisma.adminUser.update({ where: { id: access.user!.id }, data: { mfaSecret: encryptTotpSecret(pending.secret), mfaEnabledAt: new Date(), mfaEnrollmentDeadline: null } }),
        prisma.mfaRecoveryCode.deleteMany({ where: { userId: access.user!.id } }),
        prisma.mfaRecoveryCode.createMany({ data: recoveryCodes.map((code) => ({ userId: access.user!.id, codeHash: recoveryCodeHash(code) })) }),
      ])
      cookieStore.delete(ENROLLMENT_COOKIE)
      await audit("MFA_ENABLED", "ADMIN_USER", { actorId: access.user!.id, ip: clientAddress(request.headers) })
      return Response.json({ enabled: true, recoveryCodes })
    }

    if (action === "disable") {
      if (!verifyAdminTotp(account.mfaSecret, code)) return Response.json({ error: "Kode autentikator tidak valid." }, { status: 400 })
      await prisma.$transaction([
        prisma.adminUser.update({ where: { id: access.user!.id }, data: { mfaSecret: null, mfaEnabledAt: null, mfaEnrollmentDeadline: new Date() } }),
        prisma.adminSession.deleteMany({ where: { userId: access.user!.id } }),
        prisma.mfaRecoveryCode.deleteMany({ where: { userId: access.user!.id } }),
      ])
      cookieStore.delete(ENROLLMENT_COOKIE)
      await audit("MFA_DISABLED", "ADMIN_USER", { actorId: access.user!.id, ip: clientAddress(request.headers) })
      return Response.json({ enabled: false, signedOut: true })
    }
    return Response.json({ error: "Tindakan MFA tidak valid." }, { status: 400 })
  } catch (error) {
    if (configurationError(error)) return Response.json({ error: "MFA belum dapat diaktifkan karena MFA_ENCRYPTION_KEY belum dikonfigurasi di server." }, { status: 503 })
    return Response.json({ error: "Pengaturan MFA gagal diproses." }, { status: 400 })
  }
}
