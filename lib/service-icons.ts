import { createElement, type ComponentProps, forwardRef } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Baby01Icon, BadgeIcon, FileHeartIcon, FileTextIcon, HandHeartIcon, HeartHandshakeIcon, MapPinnedIcon, ShieldCheckIcon, Store01Icon } from "@hugeicons/core-free-icons"

export const SERVICE_ICON_OPTIONS = [
  { value: "description", label: "Dokumen" }, { value: "storefront", label: "Usaha" }, { value: "heart", label: "Bantuan" }, { value: "shield", label: "SKCK" }, { value: "heart-handshake", label: "Pernikahan" }, { value: "baby", label: "Kelahiran" }, { value: "file-heart", label: "Kematian" }, { value: "map-pinned", label: "Pindah / datang" }, { value: "badge", label: "KK / KTP" },
] as const

type HugeIconProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon">
const makeIcon = (icon: IconSvgElement) => forwardRef<SVGSVGElement, HugeIconProps>(function ServiceIcon({ strokeWidth = 1.8, ...props }, ref) { return createElement(HugeiconsIcon, { ref, icon, strokeWidth, "aria-hidden": true, ...props }) })
const iconMap = { description: makeIcon(FileTextIcon), storefront: makeIcon(Store01Icon), heart: makeIcon(HandHeartIcon), shield: makeIcon(ShieldCheckIcon), "heart-handshake": makeIcon(HeartHandshakeIcon), baby: makeIcon(Baby01Icon), "file-heart": makeIcon(FileHeartIcon), "map-pinned": makeIcon(MapPinnedIcon), badge: makeIcon(BadgeIcon) }
export function getServiceIcon(value: string) { return iconMap[value as keyof typeof iconMap] ?? iconMap.description }
