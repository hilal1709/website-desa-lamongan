import { forwardRef, type ComponentProps } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon"
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon"
import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import CheckmarkCircle01Icon from "@hugeicons/core-free-icons/CheckmarkCircle01Icon"
import Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon"
import FilePenLineIcon from "@hugeicons/core-free-icons/FilePenLineIcon"
import FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon"
import MapPinIcon from "@hugeicons/core-free-icons/MapPinIcon"
import MessageCircleMoreIcon from "@hugeicons/core-free-icons/MessageCircleMoreIcon"
import SendIcon from "@hugeicons/core-free-icons/SendIcon"
import ShieldCheckIcon from "@hugeicons/core-free-icons/ShieldCheckIcon"
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon"

type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon">

function createComplaintIcon(iconDefinition: IconSvgElement) {
  return forwardRef<SVGSVGElement, IconProps>(function ComplaintIcon({ strokeWidth = 1.8, ...props }, ref) {
    return <HugeiconsIcon ref={ref} icon={iconDefinition} strokeWidth={strokeWidth} focusable="false" {...props} />
  })
}

export const ComplaintAlertIcon = createComplaintIcon(AlertCircleIcon)
export const ComplaintArrowLeftIcon = createComplaintIcon(ArrowLeft01Icon)
export const ComplaintArrowRightIcon = createComplaintIcon(ArrowRight01Icon)
export const ComplaintCheckIcon = createComplaintIcon(CheckmarkCircle01Icon)
export const ComplaintClockIcon = createComplaintIcon(Clock01Icon)
export const ComplaintCloseIcon = createComplaintIcon(Cancel01Icon)
export const ComplaintFileIcon = createComplaintIcon(FileTextIcon)
export const ComplaintFormIcon = createComplaintIcon(FilePenLineIcon)
export const ComplaintLocationIcon = createComplaintIcon(MapPinIcon)
export const ComplaintMessageIcon = createComplaintIcon(MessageCircleMoreIcon)
export const ComplaintSendIcon = createComplaintIcon(SendIcon)
export const ComplaintShieldIcon = createComplaintIcon(ShieldCheckIcon)
export const ComplaintSparklesIcon = createComplaintIcon(SparklesIcon)
