import type { ComponentProps } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import Alert01Icon from "@hugeicons/core-free-icons/Alert01Icon"
import CancelCircleIcon from "@hugeicons/core-free-icons/CancelCircleIcon"
import CheckmarkCircle01Icon from "@hugeicons/core-free-icons/CheckmarkCircle01Icon"
import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon"
import Key01Icon from "@hugeicons/core-free-icons/Key01Icon"
import Loading03Icon from "@hugeicons/core-free-icons/Loading03Icon"
import LockKeyholeIcon from "@hugeicons/core-free-icons/LockKeyholeIcon"
import ShieldCheckIcon from "@hugeicons/core-free-icons/ShieldCheckIcon"
import ShieldEllipsisIcon from "@hugeicons/core-free-icons/ShieldEllipsisIcon"

const createIcon = (icon: IconSvgElement) => ({ className, ...props }: Omit<ComponentProps<typeof HugeiconsIcon>, "icon">) => <HugeiconsIcon icon={icon} strokeWidth={1.8} className={className} aria-hidden="true" focusable="false" {...props} />

export const SecurityIcons = {
  alert: createIcon(Alert01Icon),
  check: createIcon(CheckmarkCircle01Icon),
  copy: createIcon(Copy01Icon),
  error: createIcon(CancelCircleIcon),
  key: createIcon(Key01Icon),
  loading: createIcon(Loading03Icon),
  lock: createIcon(LockKeyholeIcon),
  shield: createIcon(ShieldCheckIcon),
  status: createIcon(ShieldEllipsisIcon),
}
