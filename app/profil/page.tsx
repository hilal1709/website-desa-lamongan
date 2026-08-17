import type { Metadata } from "next"

import { getCmsPage } from "@/lib/cms-pages"
import { VillageMap } from "@/components/profil/village-map"
import { ProfileVideoHero } from "@/components/profil/profile-video-hero"
import { ProfileMotion } from "@/components/profil/profile-motion"
import { GovernmentCtaSection, ProfileHistorySection, VisionMissionSection } from "@/components/profil/profile-sections"

export const revalidate = 3600

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
  const section = (key: string) => profile.sections.find((item) => item.key === key)
  const villageMap = section("village-map")

  return (
    <>
      <ProfileVideoHero eyebrow={profile.eyebrow} title={profile.title} description={profile.description} />
      <main id="main-content">
        <ProfileMotion>
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:py-20">
            <ProfileHistorySection section={section("history")} />
            <VisionMissionSection section={section("vision-mission")} />
            <GovernmentCtaSection section={section("government-cta")} />
            {villageMap ? (
              <div className="profile-map">
                <VillageMap
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
      </main>
    </>
  )
}
