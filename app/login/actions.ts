"use server"

import { redirect } from "next/navigation"

import { authenticateAdmin, createAdminSession } from "@/lib/admin-auth"

export type LoginState = { error?: string }

export async function loginAdmin(_: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!identifier || !password) return { error: "Username dan kata sandi wajib diisi." }

  const admin = await authenticateAdmin(identifier, password)
  if (!admin) return { error: "Username atau kata sandi tidak valid." }

  await createAdminSession(admin.id)
  redirect("/admin")
}
