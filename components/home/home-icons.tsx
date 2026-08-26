import { forwardRef, type ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon"
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon"
import Building01Icon from "@hugeicons/core-free-icons/Building01Icon"
import File01Icon from "@hugeicons/core-free-icons/File01Icon"
import HeartCheckIcon from "@hugeicons/core-free-icons/HeartCheckIcon"
import LandmarkIcon from "@hugeicons/core-free-icons/LandmarkIcon"
import MapPinIcon from "@hugeicons/core-free-icons/MapPinIcon"
import MapPinnedIcon from "@hugeicons/core-free-icons/MapPinnedIcon"
import Message01Icon from "@hugeicons/core-free-icons/Message01Icon"
import News01Icon from "@hugeicons/core-free-icons/News01Icon"
import ShieldAlertIcon from "@hugeicons/core-free-icons/ShieldAlertIcon"
import ShieldCheckIcon from "@hugeicons/core-free-icons/ShieldCheckIcon"
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon"
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon"

type IconProps = ComponentProps<typeof HugeiconsIcon>

function createHomeIcon(iconDefinition: IconSvgElement) {
  return forwardRef<SVGSVGElement, IconProps>(function HomeIcon({ icon: _icon, strokeWidth = 1.8, ...props }, ref) {
    void _icon
    return <HugeiconsIcon ref={ref} icon={iconDefinition} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props} />
  }) as unknown as LucideIcon
}

export const HomeArrowRightIcon = createHomeIcon(ArrowRight01Icon)
export const HomeArrowUpRightIcon = createHomeIcon(ArrowUpRight01Icon)
export const HomeBuildingIcon = createHomeIcon(Building01Icon)
export const HomeFileIcon = createHomeIcon(File01Icon)
export const HomeHeartIcon = createHomeIcon(HeartCheckIcon)
export const HomeLandmarkIcon = createHomeIcon(LandmarkIcon)
export const HomeMapPinIcon = createHomeIcon(MapPinIcon)
export const HomeMapPinnedIcon = createHomeIcon(MapPinnedIcon)
export const HomeMessageIcon = createHomeIcon(Message01Icon)
export const HomeNewsIcon = createHomeIcon(News01Icon)
export const HomeShieldAlertIcon = createHomeIcon(ShieldAlertIcon)
export const HomeShieldCheckIcon = createHomeIcon(ShieldCheckIcon)
export const HomeSparklesIcon = createHomeIcon(SparklesIcon)
export const HomeUsersIcon = createHomeIcon(UserGroupIcon)
