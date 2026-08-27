export function createInfographicDatasetJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Infografis Desa Kedungrejo",
    description: "Data kependudukan, peristiwa warga, UMKM, dan layanan kesehatan Desa Kedungrejo.",
    url: "/infografis",
    creator: { "@type": "GovernmentOrganization", name: "Pemerintah Desa Kedungrejo" },
    spatialCoverage: { "@type": "AdministrativeArea", name: "Desa Kedungrejo, Lamongan" },
    license: "https://creativecommons.org/licenses/by/4.0/",
  }
}
