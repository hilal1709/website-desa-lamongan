export function ComplaintJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Aduan Warga Desa Kedungrejo",
    description: "Portal untuk menyampaikan aduan warga kepada Pemerintah Desa Kedungrejo.",
    url: "/aduan",
    mainEntity: {
      "@type": "GovernmentService",
      name: "Layanan Aduan Warga",
      provider: { "@type": "GovernmentOrganization", name: "Pemerintah Desa Kedungrejo" },
      audience: { "@type": "Audience", audienceType: "Warga Desa Kedungrejo" },
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
