export function HomeJsonLd() {
  const schema = { "@context": "https://schema.org", "@type": "GovernmentOrganization", name: "Pemerintah Desa Kedungrejo", url: "/", logo: "/images/logokedungrejo.png", description: "Portal resmi Desa Kedungrejo untuk informasi pemerintahan dan layanan warga.", address: { "@type": "PostalAddress", addressLocality: "Lamongan", addressRegion: "Jawa Timur", addressCountry: "ID" } }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
