import { forwardRef, type ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import BarChartIcon from "@hugeicons/core-free-icons/BarChartIcon"
import BriefcaseBusinessIcon from "@hugeicons/core-free-icons/BriefcaseBusinessIcon"
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon"
import ChartIncreaseIcon from "@hugeicons/core-free-icons/ChartIncreaseIcon"
import File01Icon from "@hugeicons/core-free-icons/File01Icon"
import GraduationCapIcon from "@hugeicons/core-free-icons/GraduationCapIcon"
import HeartIcon from "@hugeicons/core-free-icons/HeartIcon"
import Home01Icon from "@hugeicons/core-free-icons/Home01Icon"
import MapPinIcon from "@hugeicons/core-free-icons/MapPinIcon"
import MessageCircleIcon from "@hugeicons/core-free-icons/MessageCircleIcon"
import PackageIcon from "@hugeicons/core-free-icons/PackageIcon"
import PrinterIcon from "@hugeicons/core-free-icons/PrinterIcon"
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon"
import StethoscopeIcon from "@hugeicons/core-free-icons/StethoscopeIcon"
import Store01Icon from "@hugeicons/core-free-icons/Store01Icon"
import Tag01Icon from "@hugeicons/core-free-icons/Tag01Icon"
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon"
import UserMultipleIcon from "@hugeicons/core-free-icons/UserMultipleIcon"

type IconProps = ComponentProps<typeof HugeiconsIcon>
const makeIcon = (definition: IconSvgElement) => forwardRef<SVGSVGElement, IconProps>(function InfographicIcon({ icon: _icon, strokeWidth = 1.8, ...props }, ref) { void _icon; return <HugeiconsIcon ref={ref} icon={definition} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...props} /> }) as unknown as LucideIcon

export const BarChart3 = makeIcon(BarChartIcon)
export const Boxes = makeIcon(PackageIcon)
export const BriefcaseBusiness = makeIcon(BriefcaseBusinessIcon)
export const CalendarDays = makeIcon(Calendar01Icon)
export const FileSpreadsheet = makeIcon(File01Icon)
export const FileText = makeIcon(File01Icon)
export const GraduationCap = makeIcon(GraduationCapIcon)
export const HeartPulse = makeIcon(HeartIcon)
export const Home = makeIcon(Home01Icon)
export const MapPin = makeIcon(MapPinIcon)
export const MapPinned = makeIcon(MapPinIcon)
export const MessageCircle = makeIcon(MessageCircleIcon)
export const Package = makeIcon(PackageIcon)
export const Printer = makeIcon(PrinterIcon)
export const Search = makeIcon(Search01Icon)
export const Stethoscope = makeIcon(StethoscopeIcon)
export const Store = makeIcon(Store01Icon)
export const Tag = makeIcon(Tag01Icon)
export const TrendingUp = makeIcon(ChartIncreaseIcon)
export const UserCheck = makeIcon(UserMultipleIcon)
export const Users = makeIcon(UserGroupIcon)
export const UsersRound = makeIcon(UserGroupIcon)
