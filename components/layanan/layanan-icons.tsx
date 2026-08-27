import { forwardRef, type ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon"
import CheckmarkCircle02Icon from "@hugeicons/core-free-icons/CheckmarkCircle02Icon"
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon"
import File01Icon from "@hugeicons/core-free-icons/File01Icon"
import FileCheckIcon from "@hugeicons/core-free-icons/FileCheckIcon"
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon"
import ShieldCheckIcon from "@hugeicons/core-free-icons/ShieldCheckIcon"
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon"

type IconProps = ComponentProps<typeof HugeiconsIcon>

function createLayananIcon(iconDefinition: IconSvgElement) {
  return forwardRef<SVGSVGElement, IconProps>(function LayananIcon({ icon: _icon, strokeWidth = 1.8, ...props }, ref) {
    void _icon
    return <HugeiconsIcon ref={ref} icon={iconDefinition} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props} />
  }) as unknown as LucideIcon
}

export const LayananArrowUpRightIcon = createLayananIcon(ArrowUpRight01Icon)
export const LayananCheckIcon = createLayananIcon(CheckmarkCircle02Icon)
export const LayananClockIcon = createLayananIcon(Clock01Icon)
export const LayananFileCheckIcon = createLayananIcon(FileCheckIcon)
export const LayananFileIcon = createLayananIcon(File01Icon)
export const LayananSearchIcon = createLayananIcon(Search01Icon)
export const LayananShieldCheckIcon = createLayananIcon(ShieldCheckIcon)
export const LayananSparklesIcon = createLayananIcon(SparklesIcon)
