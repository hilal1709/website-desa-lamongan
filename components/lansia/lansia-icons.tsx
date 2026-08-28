import { forwardRef, type ComponentProps } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import Activity01Icon from "@hugeicons/core-free-icons/Activity01Icon"
import Alert02Icon from "@hugeicons/core-free-icons/Alert02Icon"
import ChartColumnIcon from "@hugeicons/core-free-icons/ChartColumnIcon"
import CheckmarkCircle01Icon from "@hugeicons/core-free-icons/CheckmarkCircle01Icon"
import Delete01Icon from "@hugeicons/core-free-icons/Delete01Icon"
import Edit01Icon from "@hugeicons/core-free-icons/Edit01Icon"
import FloppyDiskIcon from "@hugeicons/core-free-icons/FloppyDiskIcon"
import HeartPulseIcon from "@hugeicons/core-free-icons/HeartPulseIcon"
import Refresh01Icon from "@hugeicons/core-free-icons/Refresh01Icon"
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon"
import SparklesIcon from "@hugeicons/core-free-icons/SparklesIcon"
import TaskAdd01Icon from "@hugeicons/core-free-icons/TaskAdd01Icon"
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon"

type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon">
const makeIcon = (icon: IconSvgElement) => forwardRef<SVGSVGElement, IconProps>(function LansiaIcon({ strokeWidth = 1.8, ...props }, ref) { return <HugeiconsIcon ref={ref} icon={icon} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props} /> })

export const Activity = makeIcon(Activity01Icon)
export const AlertTriangle = makeIcon(Alert02Icon)
export const BarChart3 = makeIcon(ChartColumnIcon)
export const Check = makeIcon(CheckmarkCircle01Icon)
export const ClipboardPlus = makeIcon(TaskAdd01Icon)
export const Edit3 = makeIcon(Edit01Icon)
export const HeartPulse = makeIcon(HeartPulseIcon)
export const Plus = makeIcon(TaskAdd01Icon)
export const RefreshCw = makeIcon(Refresh01Icon)
export const Save = makeIcon(FloppyDiskIcon)
export const Search = makeIcon(Search01Icon)
export const Sparkles = makeIcon(SparklesIcon)
export const Trash2 = makeIcon(Delete01Icon)
export const Users = makeIcon(UserGroupIcon)
