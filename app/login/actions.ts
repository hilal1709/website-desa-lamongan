"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { authenticateAdmin, consumeRecoveryCode, createAdminSession, getCurrentAdmin, verifyAdminTotp } from "@/lib/admin-auth"
import { firstPermittedCmsPath } from "@/lib/access-control"
import { clientAddress, isRateLimitedDistributed } from "@/lib/rate-limit"
import { audit } from "@/lib/audit-log"

export type LoginState = { error?: string }

export async function loginAdmin(_: LoginState, formData: FormData): Promise<LoginState> {
  const requestHeaders = await headers()
  if (await isRateLimitedDistributed(`login:${clientAddress(requestHeaders)}`, 5, 15 * 60 * 1000)) {
    return { error: "Terlalu banyak percobaan masuk. Silakan coba lagi dalam beberapa menit." }
  }
  const identifier = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const totpCode = String(formData.get("totpCode") ?? "")

  if (!identifier || !password) return { error: "Username dan kata sandi wajib diisi." }

  const admin = await authenticateAdmin(identifier, password)
  if (!admin) {
    await audit("LOGIN_FAILED", "ADMIN_SESSION", { ip: clientAddress(requestHeaders) })
    return { error: "Username atau kata sandi tidak valid." }
  }

  const totpValid = admin.isSuperAdmin && admin.mfaSecret && verifyAdminTotp(admin.mfaSecret, totpCode)
  const recoveryUsed = admin.isSuperAdmin && admin.mfaSecret && !totpValid && await consumeRecoveryCode(admin.id, totpCode)
  if (admin.isSuperAdmin && admin.mfaSecret && !totpValid && !recoveryUsed) {
    await audit("MFA_LOGIN_FAILED", "ADMIN_SESSION", { actorId: admin.id, ip: clientAddress(requestHeaders) })
    return { error: "Kode autentikator enam digit tidak valid." }
  }

  await createAdminSession(admin.id)
  if (recoveryUsed) await audit("MFA_RECOVERY_CODE_USED", "ADMIN_SESSION", { actorId: admin.id, ip: clientAddress(requestHeaders) })
  await audit("LOGIN_SUCCEEDED", "ADMIN_SESSION", { actorId: admin.id, ip: clientAddress(requestHeaders) })
  const user = await getCurrentAdmin({ allowMfaEnrollment: true })
  if (!user) redirect("/login")
  if (user.mfaEnrollmentOverdue) redirect("/admin/keamanan")
  redirect(firstPermittedCmsPath(user) ?? (firstPermittedCmsPath(user) === null ? "/posyandu-lansia" : "/admin"))
}
