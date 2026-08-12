import { PageHero } from "@/components/ui/page-hero"
import { getCmsPage } from "@/lib/cms-pages"

export async function Hero() {
  const hero = await getCmsPage("infografis")

  return (
    <PageHero
      eyebrow={hero.eyebrow}
      title={hero.title}
      description={hero.description}
      image={hero.image}
      imagePosition={hero.imagePosition}
    />
  )
}
