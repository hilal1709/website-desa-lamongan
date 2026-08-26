import Image from "next/image"

interface OrganizationDiagramImageProps {
  image: string
  title: string
  sizes?: string
}

const diagramWidth = 1024
const diagramHeight = 768
const defaultSizes = "(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 1024px"

export function OrganizationDiagramImage({ image, title, sizes = defaultSizes }: OrganizationDiagramImageProps) {
  return <Image src={image} alt={title} width={diagramWidth} height={diagramHeight} sizes={sizes} className="structure-image h-auto w-full object-contain" />
}
