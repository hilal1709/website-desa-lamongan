import type { LucideIcon } from "lucide-react"

export interface NavigationItem { label: string; href: string }
export interface Stat { label: string; value: string; detail: string; icon: LucideIcon }
export interface Service { title: string; description: string; href: string; icon: LucideIcon; tone?: "blue" | "emerald" | "amber" }
export interface NewsItem { title: string; category: string; date: string; image: string; excerpt: string }
export interface DocumentItem { title: string; category: string; date: string; size: string }
