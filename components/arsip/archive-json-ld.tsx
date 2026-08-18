import type { PublicDocument } from "./types"

export function ArchiveJsonLd({ documents }: { documents: PublicDocument[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Arsip Dokumen Publik Desa Kedungrejo",
    description: "Koleksi dokumen publik Pemerintah Desa Kedungrejo.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: documents.map((document, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "DigitalDocument", name: document.title, encodingFormat: document.meta.split(" - ")[0] },
      })),
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
}
