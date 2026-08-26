import { forwardRef, type ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon"
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon"
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon"
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import EyeIcon from "@hugeicons/core-free-icons/EyeIcon"
import Loading03Icon from "@hugeicons/core-free-icons/Loading03Icon"
import RadioIcon from "@hugeicons/core-free-icons/RadioIcon"
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon"
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon"
import Tag01Icon from "@hugeicons/core-free-icons/Tag01Icon"

type IconProps = ComponentProps<typeof HugeiconsIcon>

function createNewsIcon(iconDefinition: IconSvgElement) {
  return forwardRef<SVGSVGElement, IconProps>(function NewsIcon({ icon: _icon, strokeWidth = 1.8, ...props }, ref) {
    void _icon
    return <HugeiconsIcon ref={ref} icon={iconDefinition} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props} />
  }) as unknown as LucideIcon
}

export const NewsArrowLeftIcon = createNewsIcon(ArrowLeft01Icon)
export const NewsArrowRightIcon = createNewsIcon(ArrowRight01Icon)
export const NewsArrowUpRightIcon = createNewsIcon(ArrowUpRight01Icon)
export const NewsCalendarIcon = createNewsIcon(Calendar01Icon)
export const NewsCloseIcon = createNewsIcon(Cancel01Icon)
export const NewsEyeIcon = createNewsIcon(EyeIcon)
export const NewsLoadingIcon = createNewsIcon(Loading03Icon)
export const NewsRadioIcon = createNewsIcon(RadioIcon)
export const NewsSearchIcon = createNewsIcon(Search01Icon)
export const NewsSparklesIcon = createNewsIcon(SparklesIcon)
export const NewsTagIcon = createNewsIcon(Tag01Icon)
