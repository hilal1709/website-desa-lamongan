import type { ComponentProps } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon"
import Alert01Icon from "@hugeicons/core-free-icons/Alert01Icon"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import CancelCircleIcon from "@hugeicons/core-free-icons/CancelCircleIcon"
import CheckmarkCircle01Icon from "@hugeicons/core-free-icons/CheckmarkCircle01Icon"
import Delete01Icon from "@hugeicons/core-free-icons/Delete01Icon"
import Edit01Icon from "@hugeicons/core-free-icons/Edit01Icon"
import FloppyDiskIcon from "@hugeicons/core-free-icons/FloppyDiskIcon"
import Key01Icon from "@hugeicons/core-free-icons/Key01Icon"
import LockKeyholeIcon from "@hugeicons/core-free-icons/LockKeyholeIcon"
import ShieldCheckIcon from "@hugeicons/core-free-icons/ShieldCheckIcon"
import UserCircleIcon from "@hugeicons/core-free-icons/UserCircleIcon"
import UserMultipleIcon from "@hugeicons/core-free-icons/UserMultipleIcon"

const createIcon = (icon: IconSvgElement) => ({ className, ...props }: Omit<ComponentProps<typeof HugeiconsIcon>, "icon">) => <HugeiconsIcon icon={icon} strokeWidth={1.8} className={className} aria-hidden="true" focusable="false" {...props} />

export const AlertTriangle = createIcon(Alert01Icon)
export const Check = createIcon(CheckmarkCircle01Icon)
export const CheckCircle = createIcon(CheckmarkCircle01Icon)
export const UserCircle = createIcon(UserCircleIcon)
export const Key = createIcon(Key01Icon)
export const Lock = createIcon(LockKeyholeIcon)
export const Pencil = createIcon(Edit01Icon)
export const Plus = createIcon(Add01Icon)
export const Save = createIcon(FloppyDiskIcon)
export const ShieldCheck = createIcon(ShieldCheckIcon)
export const Trash = createIcon(Delete01Icon)
export const Users = createIcon(UserMultipleIcon)
export const Close = createIcon(Cancel01Icon)
export const ErrorCircle = createIcon(CancelCircleIcon)
