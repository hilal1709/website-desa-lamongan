import type { Metadata } from "next"

export function createAdminMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false },
  }
}
