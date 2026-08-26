export interface OrganizationDiagramProps {
  image: string
  title: string
  description?: string
  enlargeLabel?: string
  downloadLabel?: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const organizationDiagramDefaults = {
  enlargeLabel: "Perbesar gambar",
  downloadLabel: "Unduh gambar",
  eyebrow: "Bagan organisasi",
  coordinationLabel: "Alur koordinasi perangkat",
  detailLabel: "Geser untuk melihat detail",
} as const
