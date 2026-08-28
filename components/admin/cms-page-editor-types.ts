export type CmsField = "eyebrow" | "title" | "description" | "action" | "href" | "image" | "imagePosition" | "captionEyebrow" | "captionTitle" | "storyLine"
export type CmsItemField = "title" | "description" | "value" | "detail" | "href" | "image"

export type CmsSectionSettings = {
  key: string
  label: string
  fields: CmsField[]
  itemFields?: CmsItemField[]
}

export type CmsPageSettings = {
  slug: string
  href: string
  summary: string
  heroFields?: CmsField[]
  sections?: CmsSectionSettings[]
  manage?: { label: string; href: string; description: string }
}
