import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Alert01Icon, CheckmarkCircle01Icon, CloudyIcon, Delete01Icon, FloppyDiskIcon, Loading03Icon, MapPinIcon, Megaphone01Icon, ShieldAlertIcon, WavesIcon as WavesDefinition } from "@hugeicons/core-free-icons"

type Props = { className?: string }
const icon = (definition: Parameters<typeof HugeiconsIcon>[0]["icon"]) => ({ className }: Props) => <HugeiconsIcon icon={definition} className={className} aria-hidden="true" />

export const AlertIcon = icon(Alert01Icon)
export const CheckIcon = icon(CheckmarkCircle01Icon)
export const CloudIcon = icon(CloudyIcon)
export const DeleteIcon = icon(Delete01Icon)
export const LoadingIcon = icon(Loading03Icon)
export const MapIcon = icon(MapPinIcon)
export const MegaphoneIcon = icon(Megaphone01Icon)
export const PlusIcon = icon(Add01Icon)
export const SaveIcon = icon(FloppyDiskIcon)
export const ShieldIcon = icon(ShieldAlertIcon)
export const WavesIcon = icon(WavesDefinition)
