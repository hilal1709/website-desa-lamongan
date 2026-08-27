import { forwardRef, type ComponentProps } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import Add01Icon from "@hugeicons/core-free-icons/Add01Icon"
import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon"
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon"
import BarChartIcon from "@hugeicons/core-free-icons/BarChartIcon"
import BellRingIcon from "@hugeicons/core-free-icons/BellRingIcon"
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon"
import File01Icon from "@hugeicons/core-free-icons/File01Icon"
import MessageCircleIcon from "@hugeicons/core-free-icons/MessageCircleIcon"
import News01Icon from "@hugeicons/core-free-icons/News01Icon"
import Store01Icon from "@hugeicons/core-free-icons/Store01Icon"
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon"

type Props = Omit<ComponentProps<typeof HugeiconsIcon>, "icon">
const makeIcon = (icon: IconSvgElement) => forwardRef<SVGSVGElement, Props>(function DashboardIcon({ strokeWidth = 1.8, ...props }, ref) { return <HugeiconsIcon ref={ref} icon={icon} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props} /> })

export const AddIcon = makeIcon(Add01Icon)
export const AlertIcon = makeIcon(AlertCircleIcon)
export const ArrowIcon = makeIcon(ArrowRight01Icon)
export const ChartIcon = makeIcon(BarChartIcon)
export const BellIcon = makeIcon(BellRingIcon)
export const CancelIcon = makeIcon(Cancel01Icon)
export const FileIcon = makeIcon(File01Icon)
export const MessageIcon = makeIcon(MessageCircleIcon)
export const NewsIcon = makeIcon(News01Icon)
export const StoreIcon = makeIcon(Store01Icon)
export const UsersIcon = makeIcon(UserGroupIcon)
export const ChevronRight = ArrowIcon
export const BarChart3 = ChartIcon
export const LayoutDashboard = ChartIcon
export const HeartPulse = UsersIcon
export const Store = StoreIcon
export const ShieldAlert = AlertIcon
export const Newspaper = NewsIcon
export const FileText = FileIcon
export const MessageSquare = MessageIcon
export const Settings = FileIcon
export const ArrowUpRight = ArrowIcon
