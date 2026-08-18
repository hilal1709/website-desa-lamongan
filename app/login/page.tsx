import type { Metadata } from "next"
import { LoginPageContent } from "@/components/auth/login-page-content"

export const metadata: Metadata = {
  title: "Login CMS Admin | Desa Kedungrejo",
  description: "Halaman masuk untuk pengelolaan CMS Desa Kedungrejo.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
}

// The login shell contains no request-specific data and can be reused by the CDN.
export const revalidate = 3600

export default function LoginPage() {
  return <LoginPageContent />
}
