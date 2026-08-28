import { HugeiconsIcon } from "@hugeicons/react"
import {
  Add01Icon,
  Alert01Icon,
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Delete01Icon,
  FileTextIcon,
  FloppyDiskIcon,
  ImageAdd01Icon,
  PencilIcon,
  Search01Icon,
  SendIcon,
  TagsIcon,
} from "@hugeicons/core-free-icons"

type IconProps = { className?: string }

export const AlertCircle = ({ className }: IconProps) => <HugeiconsIcon icon={AlertCircleIcon} className={className} />
export const AlertTriangle = ({ className }: IconProps) => <HugeiconsIcon icon={Alert01Icon} className={className} />
export const CheckCircle = ({ className }: IconProps) => <HugeiconsIcon icon={CheckmarkCircle01Icon} className={className} />
export const Clock = ({ className }: IconProps) => <HugeiconsIcon icon={Clock01Icon} className={className} />
export const FileText = ({ className }: IconProps) => <HugeiconsIcon icon={FileTextIcon} className={className} />
export const ImageAdd = ({ className }: IconProps) => <HugeiconsIcon icon={ImageAdd01Icon} className={className} />
export const Pencil = ({ className }: IconProps) => <HugeiconsIcon icon={PencilIcon} className={className} />
export const Plus = ({ className }: IconProps) => <HugeiconsIcon icon={Add01Icon} className={className} />
export const Save = ({ className }: IconProps) => <HugeiconsIcon icon={FloppyDiskIcon} className={className} />
export const Search = ({ className }: IconProps) => <HugeiconsIcon icon={Search01Icon} className={className} />
export const Send = ({ className }: IconProps) => <HugeiconsIcon icon={SendIcon} className={className} />
export const Tag = ({ className }: IconProps) => <HugeiconsIcon icon={TagsIcon} className={className} />
export const Trash = ({ className }: IconProps) => <HugeiconsIcon icon={Delete01Icon} className={className} />
export const X = ({ className }: IconProps) => <HugeiconsIcon icon={Cancel01Icon} className={className} />
