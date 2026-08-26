import { forwardRef, type ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon"
import Building01Icon from "@hugeicons/core-free-icons/Building01Icon"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import CheckmarkCircle01Icon from "@hugeicons/core-free-icons/CheckmarkCircle01Icon"
import Compass01Icon from "@hugeicons/core-free-icons/Compass01Icon"
import LeafyGreenIcon from "@hugeicons/core-free-icons/LeafyGreenIcon"
import Maximize01Icon from "@hugeicons/core-free-icons/Maximize01Icon"
import PlayIcon from "@hugeicons/core-free-icons/PlayIcon"
import TreesIcon from "@hugeicons/core-free-icons/TreesIcon"
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon"
import VolumeHighIcon from "@hugeicons/core-free-icons/VolumeHighIcon"

type IconProps = ComponentProps<typeof HugeiconsIcon>

function createProfileIcon(iconDefinition: IconSvgElement) {
  return forwardRef<SVGSVGElement, IconProps>(function ProfileIcon({ icon: _icon, strokeWidth = 1.8, ...props }, ref) {
    void _icon
    return <HugeiconsIcon ref={ref} icon={iconDefinition} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props} />
  }) as unknown as LucideIcon
}

export const ProfileArrowRightIcon = createProfileIcon(ArrowRight01Icon)
export const ProfileBuildingIcon = createProfileIcon(Building01Icon)
export const ProfileCheckIcon = createProfileIcon(CheckmarkCircle01Icon)
export const ProfileCloseIcon = createProfileIcon(Cancel01Icon)
export const ProfileCompassIcon = createProfileIcon(Compass01Icon)
export const ProfileLeafIcon = createProfileIcon(LeafyGreenIcon)
export const ProfileMaximizeIcon = createProfileIcon(Maximize01Icon)
export const ProfilePlayIcon = createProfileIcon(PlayIcon)
export const ProfileTreesIcon = createProfileIcon(TreesIcon)
export const ProfileUsersIcon = createProfileIcon(UserGroupIcon)
export const ProfileVolumeIcon = createProfileIcon(VolumeHighIcon)
