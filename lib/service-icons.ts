import { Baby, Badge, FileHeart, FileText, HandHeart, HeartHandshake, MapPinned, ShieldCheck, Store, type LucideIcon } from "lucide-react"

export const SERVICE_ICON_OPTIONS = [
  { value: "description", label: "Dokumen" },
  { value: "storefront", label: "Usaha" },
  { value: "heart", label: "Bantuan" },
  { value: "shield", label: "SKCK" },
  { value: "heart-handshake", label: "Pernikahan" },
  { value: "baby", label: "Kelahiran" },
  { value: "file-heart", label: "Kematian" },
  { value: "map-pinned", label: "Pindah / datang" },
  { value: "badge", label: "KK / KTP" },
] as const

const iconMap: Record<string, LucideIcon> = { description: FileText, storefront: Store, heart: HandHeart, shield: ShieldCheck, "heart-handshake": HeartHandshake, baby: Baby, "file-heart": FileHeart, "map-pinned": MapPinned, badge: Badge }
export function getServiceIcon(value: string): LucideIcon { return iconMap[value] ?? FileText }
