import { forwardRef, type ComponentProps } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import Alert01Icon from "@hugeicons/core-free-icons/Alert01Icon"
import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon"
import CheckmarkCircle01Icon from "@hugeicons/core-free-icons/CheckmarkCircle01Icon"
import CloudLightningIcon from "@hugeicons/core-free-icons/CloudLightningIcon"
import CloudRainIcon from "@hugeicons/core-free-icons/CloudRainIcon"
import DropletsIcon from "@hugeicons/core-free-icons/DropletsIcon"
import ExternalLinkIcon from "@hugeicons/core-free-icons/ExternalLinkIcon"
import InfoIcon from "@hugeicons/core-free-icons/InfoIcon"
import MapPinIcon from "@hugeicons/core-free-icons/MapPinIcon"
import MapPinnedIcon from "@hugeicons/core-free-icons/MapPinnedIcon"
import PhoneCallIcon from "@hugeicons/core-free-icons/PhoneCallIcon"
import RadioIcon from "@hugeicons/core-free-icons/RadioIcon"
import RefreshCwIcon from "@hugeicons/core-free-icons/RefreshCwIcon"
import ShieldAlertIcon from "@hugeicons/core-free-icons/ShieldAlertIcon"
import ShieldCheckIcon from "@hugeicons/core-free-icons/ShieldCheckIcon"
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon"
import SproutIcon from "@hugeicons/core-free-icons/SproutIcon"
import Sun01Icon from "@hugeicons/core-free-icons/Sun01Icon"

type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon">

function createDisasterIcon(iconDefinition: IconSvgElement) {
  return forwardRef<SVGSVGElement, IconProps>(function DisasterIcon({ strokeWidth = 1.8, ...props }, ref) {
    return <HugeiconsIcon ref={ref} icon={iconDefinition} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props} />
  })
}

export const DisasterAlertIcon = createDisasterIcon(Alert01Icon)
export const DisasterAlertCircleIcon = createDisasterIcon(AlertCircleIcon)
export const DisasterCheckIcon = createDisasterIcon(CheckmarkCircle01Icon)
export const DisasterCloudLightningIcon = createDisasterIcon(CloudLightningIcon)
export const DisasterCloudRainIcon = createDisasterIcon(CloudRainIcon)
export const DisasterDropletsIcon = createDisasterIcon(DropletsIcon)
export const DisasterExternalLinkIcon = createDisasterIcon(ExternalLinkIcon)
export const DisasterInfoIcon = createDisasterIcon(InfoIcon)
export const DisasterMapPinIcon = createDisasterIcon(MapPinIcon)
export const DisasterMapPinnedIcon = createDisasterIcon(MapPinnedIcon)
export const DisasterPhoneIcon = createDisasterIcon(PhoneCallIcon)
export const DisasterRadioIcon = createDisasterIcon(RadioIcon)
export const DisasterRefreshIcon = createDisasterIcon(RefreshCwIcon)
export const DisasterShieldAlertIcon = createDisasterIcon(ShieldAlertIcon)
export const DisasterShieldCheckIcon = createDisasterIcon(ShieldCheckIcon)
export const DisasterSparklesIcon = createDisasterIcon(SparklesIcon)
export const DisasterSproutIcon = createDisasterIcon(SproutIcon)
export const DisasterSunIcon = createDisasterIcon(Sun01Icon)
