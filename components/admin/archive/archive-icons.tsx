import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Add01Icon, AlertCircleIcon, Archive01Icon, Cancel01Icon, CheckmarkCircle01Icon, Delete01Icon, Download01Icon, FileTextIcon, FloppyDiskIcon, FolderOpenIcon, PencilIcon, RefreshCwIcon, Search01Icon, ShieldCheckIcon, SquareLock01Icon, Upload01Icon } from "@hugeicons/core-free-icons"

type IconProps = { className?: string }
function icon(glyph: IconSvgElement) {
  const ArchiveIcon = ({ className }: IconProps) => <HugeiconsIcon icon={glyph} className={className} strokeWidth={1.8} aria-hidden="true" />
  ArchiveIcon.displayName = "ArchiveIcon"
  return ArchiveIcon
}

export const AlertCircle = icon(AlertCircleIcon)
export const CheckCircle2 = icon(CheckmarkCircle01Icon)
export const Download = icon(Download01Icon)
export const FileArchive = icon(Archive01Icon)
export const FileText = icon(FileTextIcon)
export const FolderOpen = icon(FolderOpenIcon)
export const Lock = icon(SquareLock01Icon)
export const Pencil = icon(PencilIcon)
export const Plus = icon(Add01Icon)
export const RefreshCw = icon(RefreshCwIcon)
export const Save = icon(FloppyDiskIcon)
export const Search = icon(Search01Icon)
export const ShieldCheck = icon(ShieldCheckIcon)
export const Trash2 = icon(Delete01Icon)
export const Upload = icon(Upload01Icon)
export const X = icon(Cancel01Icon)
