import type { Metadata } from "next"

import { getCmsPage } from "@/lib/cms-pages"
import { LazyVillageMap } from "@/components/profil/lazy-village-map"
import { ProfileVideoHero } from "@/components/profil/profile-video-hero"
import { ProfileMotion } from "@/components/profil/profile-motion"
import { GovernmentCtaSection, ProfileHistorySection, VisionMissionSection } from "@/components/profil/profile-sections"

// CMS saves invalidate the cms-pages tag and this route. Cache the rendered
// profile between changes so repeat visits do not hit the database.
export const revalidate = 300

function findSection(sections: Awaited<ReturnType<typeof getCmsPage>>["sections"], key: string) {
  return sections.find((section) => section.key === key)
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getCmsPage("profil")
  const title = `${profile.title} | Profil Desa Kedungrejo`

  return {
    title,
    description: profile.description,
    alternates: { canonical: "/profil" },
    openGraph: {
      title,
      description: profile.description,
      locale: "id_ID",
      type: "website",
      images: [{ url: "/images/pesona-potensi-desa-poster.jpg", alt: profile.title }],
    },
  }
}

export default async function ProfilPage() {
  const profile = await getCmsPage("profil")
  const history = findSection(profile.sections, "history")
  const visionMission = findSection(profile.sections, "vision-mission")
  const governmentCta = findSection(profile.sections, "government-cta")
  const villageMap = findSection(profile.sections, "village-map")
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: profile.title,
    description: profile.description,
    inLanguage: "id-ID",
    mainEntity: {
      "@type": "GovernmentOrganization",
      name: "Pemerintah Desa Kedungrejo",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Modo",
        addressRegion: "Lamongan",
        addressCountry: "ID",
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ProfileVideoHero eyebrow={profile.eyebrow} title={profile.title} description={profile.description} />
      <section id="main-content" aria-label="Informasi profil Desa Kedungrejo">
        <ProfileMotion>
          <div className="mx-auto w-full max-w-7xl px-3 py-10 min-[390px]:px-4 sm:px-5 sm:py-16 lg:py-20">
            <ProfileHistorySection section={history} />
            <VisionMissionSection section={visionMission} />
            <GovernmentCtaSection section={governmentCta} />
            {villageMap ? (
              <div className="profile-map">
                <LazyVillageMap
                  eyebrow={villageMap.eyebrow ?? ""}
                  title={villageMap.title ?? ""}
                  description={villageMap.description ?? ""}
                  action={villageMap.action ?? ""}
                  href={villageMap.href ?? "#"}
                />
              </div>
            ) : null}
          </div>
        </ProfileMotion>
      </section>
    </>
  )
}
